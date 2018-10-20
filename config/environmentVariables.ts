const { 
  SLACK_KEY, 
  GOOGLE_SHEET_ID 
} = process.env;

if (SLACK_KEY == null) {
  throw Error('process.env.SLACK_KEY is not defined');
}

if (GOOGLE_SHEET_ID == null) {
  throw Error('process.env.GOOGLE_SHEET_ID is not defined')
}

export default Object.freeze({
  SLACK_KEY,
  GOOGLE_SHEET_ID
});
