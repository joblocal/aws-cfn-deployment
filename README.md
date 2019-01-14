# AWS CloudFormation Deployment

![Downloads](https://img.shields.io/npm/dt/@joblocal\/aws-cfn-deployment.svg)

The Project provides a CLI tool for create and/or update an AWS CloudFormation.
For example to create or update an AWS CloudFormation during a running pipeline.

## Requirements
- AWS environment configuration
- Yarn or npm
- Node

## Installation

Using yarn for global usage:
```sh
$ yarn global add @joblocal/aws-cfn-deployment
```

Using npm for global usage:

```sh
$ npm install -g @joblocal/aws-cfn-deployment
```

Installing as a local dependency using yarn:
```sh
$ yarn add @joblocal/aws-cfn-deployment
```

Installing as a local dependency using npm:

```sh
$ npm install @joblocal/aws-cfn-deployment
```

### Usage
Before you can use this package you need to configure your AWS environment
variables. The easiest way is to use [AWS CLI](https://aws.amazon.com/de/cli/).

After installing the package you can use it as follows.

```sh
$ aws-cfn-deployment
  --region {region}
  --stackName {stack name}
  --templatePath {path to your CloudFormation File}
  --{cfn parameter name} {cfn parameter value}
  --{cfn parameter name} {cfn parameter value}
  --{cfn parameter name} {cfn parameter value}
  ...
```

### Parameters
The parameters **region**, **stackName** and **templatePath** are required.
All required parameters for your CloudFormation file are attached (see example).

### Example

AWS CloudFormation file (bucket.yaml):
```yaml
---
AWSTemplateFormatVersion: '2010-09-09'
Description: Creates a S3 bucket.

Parameters:

  BucketName:
    Description: Name of your S3 bucket.
    Type: String

Resources:
  DeploymentBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub ${AWS::AccountId}-{BucketName}
```

Command:
```sh
$ aws-cfn-deployment
  --region us-east-1
  --stackName MyBucket
  --templatePath bucket.yaml
  --BucketName AwesomeBucket
```

## Built with
* [Yarn](https://yarnpkg.com/lang/en/) - Dependency Management
* [Jest](https://facebook.github.io/jest/) - Test Runner

## Contributing
Please read through our [contributing guidelines](https://github.com/joblocal/aws-cfn-deployment/blob/master/CONTRIBUTING.md). Included are directions for opening issues, coding standards, and feature requests.


## Authors
* **Joblocal GmbH** - *Initial work* - [Joblocal](https://github.com/joblocal)

See also the list of [contributors](https://github.com/joblocal/aws-cfn-deployment/contributors) who participated in this project.
