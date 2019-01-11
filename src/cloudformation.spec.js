/**
* @jest-environment node
*/

const { createClient } = require('./cloudformation');

const createCfn = ({
  describeError,
  createError,
  updateError,
  waitForError,
}) => ({
  describeStacks: jest.fn((options, callback) => {
    callback(describeError, {
      Stacks: [
        {},
      ],
    });
  }),
  createStack: jest.fn((options, callback) => {
    callback(createError, null);
  }),
  updateStack: jest.fn((options, callback) => {
    callback(updateError, null);
  }),
  waitFor: jest.fn((status, options, callback) => {
    callback(waitForError, null);
  }),
});

describe('deploy stack', () => {
  test('to create a new stack', async () => {
    const cfn = createCfn({
      describeError: true,
    });
    const { deploy } = createClient(cfn);

    await deploy({});

    expect(cfn.describeStacks).toHaveBeenCalled();
    expect(cfn.createStack).toHaveBeenCalled();
    expect(cfn.waitFor).toHaveBeenCalled();
  });

  test('to update a existing stack', async () => {
    const cfn = createCfn({});
    const { deploy } = createClient(cfn);

    await deploy({});

    expect(cfn.describeStacks).toHaveBeenCalled();
    expect(cfn.updateStack).toHaveBeenCalled();
    expect(cfn.waitFor).toHaveBeenCalled();
  });

  test('to no updates be peformed', async () => {
    const cfn = createCfn({
      updateError: {
        statusCode: 400,
        message: 'No updates are to be performed.',
      },
    });
    const { deploy } = createClient(cfn);

    await deploy({});

    expect(cfn.describeStacks).toHaveBeenCalled();
    expect(cfn.updateStack).toHaveBeenCalled();
    expect(cfn.waitFor).toHaveBeenCalled();
  });

  test('to reject createStack', async () => {
    const cfn = createCfn({
      createError: { message: 'error create stack' },
    });
    const { deploy } = createClient(cfn);

    try {
      await deploy({});
    } catch (e) {
      expect(e).toEqual({ message: 'error create stack' });
    }
  });

  test('to reject updateStack', async () => {
    const cfn = createCfn({
      updateError: { message: 'error update stack' },
    });
    const { deploy } = createClient(cfn);

    try {
      await deploy({});
    } catch (e) {
      expect(e).toEqual({ message: 'error update stack' });
    }
  });

  test('to reject waitFor', async () => {
    const cfn = createCfn({
      waitForError: { message: 'error wait for' },
    });
    const { deploy } = createClient(cfn);

    try {
      await deploy({});
    } catch (e) {
      expect(e).toEqual({ message: 'error wait for' });
    }
  });
});
