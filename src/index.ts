import * as schedule from 'node-schedule';
import { RTMClient } from '@slack/client';
import SLACK_KEY from '../config/keys';

const rtm = new RTMClient(SLACK_KEY);
rtm.start();

rtm.on('message', async (event) => {
  debugger;
  console.log(event);
});
