import { WebClient } from '@slack/client';
import Scheduler from './schedulers'; 
import env from 'config/environmentVariables';
import { User, Users, UsersLocal } from 'models/users';

const web = new WebClient(env.SLACK_KEY);
const scheduler = new Scheduler(web);
scheduler.start();

const usersRepo = new UsersLocal()
console.log("User by date", usersRepo.userByDate(new Date()), " additional stirng ");
