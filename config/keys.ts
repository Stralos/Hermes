const { SLACK_KEY } = process.env;

if (SLACK_KEY == null) {
  throw Error('process.env.SLACK_KEY is not defined');
}

const key = SLACK_KEY;

export default key;
