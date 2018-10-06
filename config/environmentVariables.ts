const { SLACK_KEY } = process.env;

if (SLACK_KEY == null) {
  throw Error('process.env.SLACK_KEY is not defined');
}

export default Object.freeze({
  SLACK_KEY
});


