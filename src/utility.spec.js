/**
 * @jest-environment node
 */

const { utility } = require('./utility');

describe('utility', () => {
  test('to parse params', async () => {
    const fs = {
      readFile: (file, encoding, callback) => {
        callback(null, 'body');
      },
    };

    const { parseParams } = utility(fs);

    const args = {
      stackName: 'stack',
      region: 'eu-west-1',
      templatePath: 'template',
      param: 'value',
    };

    expect(await parseParams(args)).toEqual({
      StackName: 'stack',
      Parameters: [
        {
          ParameterKey: 'param',
          ParameterValue: 'value',
        },
      ],
      TemplateBody: 'body',
      Capabilities: [
        'CAPABILITY_IAM',
        'CAPABILITY_NAMED_IAM',
      ],
    });
  });

  test('to reject file read', () => {
    const fs = {
      readFile: (file, encoding, callback) => {
        callback({ message: 'error' }, null);
      },
    };

    const { parseParams } = utility(fs);

    const args = {
      stackName: 'stack',
      region: 'eu-west-1',
      templatePath: 'template',
      param: 'value',
    };

    expect(parseParams(args)).rejects.toEqual({ message: 'error' });
  });
});
