import {expect, test} from '@jest/globals'
import {required} from '../src/config'
// import {waitForInstances} from "../src/main"
// import {EC2Client} from "@aws-sdk/client-ec2"

test('required input undefined', () => {
  expect(() => required(undefined)).toThrow('Required input is missing')
})

test('required input null', () => {
  expect(() => required(null)).toThrow('Required input is missing')
})

test('required input empty', () => {
  expect(() => required('')).toThrow('Required input is missing')
})

test('required input valid', () => {
  expect(required('foo')).toBe('foo')
})

// g
