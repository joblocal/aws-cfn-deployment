const utility = (fs) => {
  const readFile = file => new Promise((resolve, reject) => {
    fs.readFile(
      file,
      'utf8',
      (error, data) => (error ? reject(error) : resolve(data)),
    );
  });

  const parseParams = async (args) => {
    const TemplateBody = await readFile(args.templatePath);

    const paramBlacklist = [
      '_',
      'region',
      'stackName',
      'templatePath',
    ];

    return {
      StackName: args.stackName,
      Parameters: Object.entries(args)
        .map(([key, value]) => ({
          ParameterKey: key,
          ParameterValue: String(value),
        }))
        .filter(p => !paramBlacklist.includes(p.ParameterKey)),
      TemplateBody,
      Capabilities: [
        'CAPABILITY_IAM',
        'CAPABILITY_NAMED_IAM',
      ],
    };
  };

  return {
    parseParams,
  };
};

module.exports = {
  utility,
};
