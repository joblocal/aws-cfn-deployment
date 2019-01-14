const createClient = (cfn) => {
  const describeStack = StackName => new Promise((resolve) => {
    cfn.describeStacks(
      {
        StackName,
      },
      (error, data) => (error ? resolve(null) : resolve(data.Stacks[0])),
    );
  });

  const createStack = stackParams => new Promise((resolve, reject) => {
    cfn.createStack(
      {
        ...stackParams,
        DisableRollback: true,
      },
      (error, data) => (error ? reject(error) : resolve(data)),
    );
  });

  const updateStack = stackParams => new Promise((resolve, reject) => {
    cfn.updateStack(
      stackParams,
      (error, data) => {
        if (error && error.statusCode !== 400 && error.message !== 'No updates are to be performed.') {
          reject(error);
        } else {
          resolve(data);
        }
      },
    );
  });

  const waitFor = ({ StackName }, status) => new Promise((resolve, reject) => {
    cfn.waitFor(status, {
      StackName,
    }, (error, data) => (error ? reject(error) : resolve(data)));
  });

  const deploy = async (stackParams) => {
    const stack = await describeStack(stackParams);

    if (!stack) {
      await createStack(stackParams);
      await waitFor(stackParams, 'stackCreateComplete');
    } else if (await updateStack(stackParams)) {
      await waitFor(stackParams, 'stackUpdateComplete');
    }
  };

  return {
    deploy,
  };
};

module.exports = {
  createClient,
};
