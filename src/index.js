#!/usr/bin/env node

const aws = require('aws-sdk');
const fs = require('fs');
const args = require('minimist')(
  process.argv.slice(2),
  {
    default: {
      region: 'eu-west-1',
      stackName: '',
      templatePath: '',
    },
  },
);
const { createClient } = require('./cloudformation');
const { utility } = require('./utility');

const { parseParams } = utility(fs);

aws.config.update({ region: args.region });

const cfn = createClient(new aws.CloudFormation());

(async () => {
  try {
    await cfn.deploy(parseParams(args));
  } catch (e) {
    console.error(e.message);
  }
})();
