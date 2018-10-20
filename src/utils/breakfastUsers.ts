
import env from 'config/environmentVariables';
import fetch from 'node-fetch';
import csv from 'csvtojson';

const SHEET_ID = env.GOOGLE_SHEET_ID;

const getBreakfastSchedule = async () => {
  const userCsvFile = await fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?gid=0&format=csv`);
  const fileContent = await userCsvFile.text();
  const users: string[] = await csv({ output: 'csv' }).fromString(fileContent);
  return users.map(user => ({
    date: user[0],
    name: user[1]
  }));
}

export default getBreakfastSchedule;
