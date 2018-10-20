import { WebClient } from '@slack/client';
import Scheduler from './schedulers'; 
import env from 'config/environmentVariables';

const web = new WebClient(env.SLACK_KEY);
const scheduler = new Scheduler(web);
scheduler.start();
