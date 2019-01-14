const utility = (fs) => {
  const readFile = file => new Promise((resolve, reject) => {
    fs.readFile(
      file,
      'utf8',
      (error, data) => (error ? reject(error) : resolve(data)),
    );
  });

  const parseParams = async (args) => {
    const paramBlacklist = [
      '_',
      'region',
      'stackName',
      'templatePath',
      'templateUrl',
    ];

    const params = {
      StackName: args.stackName,
      Parameters: Object.entries(args)
        .map(([key, value]) => ({
          ParameterKey: key,
          ParameterValue: String(value),
        }))
        .filter(p => !paramBlacklist.includes(p.ParameterKey)),
      Capabilities: [
        'CAPABILITY_IAM',
        'CAPABILITY_NAMED_IAM',
      ],
    };

    if (args.templateUrl) {
      params.TemplateUrl = args.templateUrl;
    } else {
      params.TemplateBody = await readFile(args.templatePath);
    }

    return params;
  };

  return {
    parseParams,
  };
};

module.exports = {
  utility,
};
