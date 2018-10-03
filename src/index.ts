// import * as schedule from 'node-schedule';
import { RTMClient } from '@slack/client';
import SLACK_KEY from '../config/keys'
import MessageController from './controllers/MessageController';
import { User, Users, UserLocal } from './models/users';

// const rtm = new RTMClient(SLACK_KEY);
// rtm.start();

// rtm.on('message', new MessageController(rtm).sendMessage);


const usersRepo = new UsersLocal()

console.log("User by date", usersRepo.userByDate(new Date()), " additional stirng ");
