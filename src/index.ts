import * as schedule from 'node-schedule';
import { WebClient } from '@slack/client';
import SLACK_KEY from '../config/keys'
import { User, Users, UsersLocal } from './models/users';

const web = new WebClient(SLACK_KEY);

async function getGeneralChatId() {
  const result = await web.channels.list();
  const { id, members } = (<any> result).channels.find((channel: any) => channel.name === 'general');
  return { id, members };
};

async function postToChannel({ id, members }: { id: string, members: string[]}) {
  web.chat.postMessage({ channel: id, text: `<@${members[2]}> needs to bring food next time!` })
}

getGeneralChatId().then(postToChannel);

const usersRepo = new UsersLocal()
console.log("User by date", usersRepo.userByDate(new Date()), " additional stirng ");
