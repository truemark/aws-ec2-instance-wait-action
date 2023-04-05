import * as core from '@actions/core'
import {DescribeInstanceStatusCommand, EC2Client} from '@aws-sdk/client-ec2'
import {loadConfig} from './config'

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function run(): Promise<void> {
  try {
    const config = loadConfig()
    console.log(`Waiting for instances ${config.instanceIds} to be ready`)
    const ec2Client = new EC2Client({region: config.region})
    const command = new DescribeInstanceStatusCommand({
      InstanceIds: config.instanceIds
    })
    const output = await ec2Client.send(command)
    if (output.InstanceStatuses === undefined || output.InstanceStatuses.length === 0) {
      throw new Error('No instances found')
    }
    const timeout = new Date().getMilliseconds() + config.timeout
    let status = false
    do {
      if (new Date().getMilliseconds() < timeout) {
        throw new Error('Timeout exceeded')
      }
      status = output.InstanceStatuses.map(
        instance =>
          instance.InstanceState?.Name === 'running' &&
          instance.SystemStatus?.Status === 'ok' &&
          instance.InstanceStatus?.Status === 'ok'
      ).reduce((acc, cur) => acc && cur, true)
      await sleep(5000)
    } while (!status)
    console.log(`Instances ${config.instanceIds} are ready`)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
