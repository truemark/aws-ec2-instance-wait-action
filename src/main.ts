import * as core from '@actions/core'
import {DescribeInstanceStatusCommand, EC2Client} from '@aws-sdk/client-ec2'
import {loadConfig} from './config'

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function waitForInstances(ec2Client: EC2Client, instanceIds: string[], timeout: number): Promise<void> {
  console.log(`Waiting for instances ${instanceIds} to be ready`)
  const command = new DescribeInstanceStatusCommand({
    InstanceIds: instanceIds
  })
  const timeoutDate = new Date().getTime() + timeout
  let status = false
  do {
    if (new Date().getTime() > timeoutDate) {
      throw new Error('Timeout exceeded')
    }
    let output = await ec2Client.send(command)
    if (output.InstanceStatuses === undefined || output.InstanceStatuses.length === 0) {
      let count = 0
      while (count < 3) {
        count++
        await sleep(count * 3000)
        output = await ec2Client.send(command)
      }
      if (output.InstanceStatuses === undefined || output.InstanceStatuses.length === 0) {
        throw new Error('No instances found')
      }
    }
    status = output.InstanceStatuses.map(
      instance =>
        instance.InstanceState?.Name === 'running' &&
        instance.SystemStatus?.Status === 'ok' &&
        instance.InstanceStatus?.Status === 'ok'
    ).every(Boolean)
    if (!status) {
      await sleep(3000)
    }
  } while (!status)
  console.log(`Instances ${instanceIds} are ready`)
}

async function run(): Promise<void> {
  try {
    const config = loadConfig()
    const ec2Client = new EC2Client({region: config.region})
    await waitForInstances(ec2Client, config.instanceIds, config.timeout)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
