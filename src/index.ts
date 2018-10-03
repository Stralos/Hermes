// import * as schedule from 'node-schedule';
import { RTMClient } from '@slack/client';
import SLACK_KEY from '../config/keys'
import MessageController from './controllers/MessageController';

const rtm = new RTMClient(SLACK_KEY);
rtm.start();
rtm.on('message', new MessageController(rtm).sendMessage);
