# AWS EC2 Wait Action

[![LICENSE](https://img.shields.io/badge/license-BSD3-green)](LICENSE)
[![Latest Release](https://img.shields.io/github/v/release/truemark/aws-ec2-instance-wait-action)](https://github.com/truemark/aws-ec2-instance-wait-action/releases)
![GitHub closed issues](https://img.shields.io/github/issues-closed/truemark/aws-ec2-instance-wait-action)
![GitHub closed pull requests](https://img.shields.io/github/issues-pr-closed/truemark/aws-ec2-instance-wait-action)
![build-test](https://github.com/truemark/aws-ec2-instance-wait-action/workflows/build-test/badge.svg)

This action will wait for an EC2 instance to reach a running state and pass status checks.

## Example

```yml
      - name: Wait for instances
        id: ec2-wait
        uses: truemark/aws-ec2-instance-wait-action@v3
        with:
          instance-ids: ${{ steps.ec2-arm64.outputs.instance-id }},${{ steps.ec2-amd64.outputs.instance-id }}
          region: "us-east-2"
          timeout-ms: "600000"
```

## Inputs

| Name         | Type   | Required | Description                                                                                                |
|--------------|--------|----------|------------------------------------------------------------------------------------------------------------|
| instance-ids | string | Yes      | Comma separated list of instance IDs to wait for                                                           |
| timeout-ms   | string | No       | Timeout in milliseconds to wait for the instance to reach a running state. Default is 600000 (10 minutes)  |
| region       | string | Yes      | AWS region to use                                                                                          |


## Development

> Install `node version 16`

Install the dependencies
```bash
$ npm install
```

Build the typescript and package it for distribution
```bash
$ npm run build && npm run package
```

Run the tests :heavy_check_mark:
```bash
$ npm test
```
