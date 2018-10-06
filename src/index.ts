import * as schedule from 'node-schedule';
import { WebClient, WebAPICallResult } from '@slack/client';
import env from 'config/environmentVariables';
import { User, Users, UsersLocal } from 'models/users';
import Channels from 'models/channels';
import Member from 'models/member';
import Members from 'models/members';
import ChannelNames from 'models/channelNames';

const web = new WebClient(env.SLACK_KEY);

async function getChannelByName(name: string) {
  const result = <Channels & WebAPICallResult> await web.conversations.list();
  const channel = result.channels.find(channel => channel.name === name);
  
  if (channel == null) {
    throw Error(`channel with name [${name}] not found !`);
  }

  return channel;
};

async function getSlackMembers() {
  const result = <Members & WebAPICallResult> await web.users.list();
  return result.members;
}

function getUserByName(name: string, members: Member[]) {
  return members.find(member => member.name === name);
}

async function postToChannel(channelId: string, message: string) {
  web.chat.postMessage({ channel: channelId, text: message })
}

function getUserNameWhoNeedsToBringBreakfest(): string {
  return 'Paulius';
}

async function sendReminderForBreakfest() {
  try {
    const users = await getSlackMembers();
    const breakfestUserName = getUserNameWhoNeedsToBringBreakfest();
    const breakfestUser = users.find(user => user.real_name === breakfestUserName);
    if (breakfestUser == null) {
      throw Error(`User [${breakfestUserName}] not found in slack users`);
    }
    const channel = await getChannelByName(ChannelNames.GENERAL);
    postToChannel(
      channel.id, 
      `<@${breakfestUser.id}> needs to bring food next time!`
    );
  } catch(e) {
    console.log('Error has happend', e);
  }
}

sendReminderForBreakfest();


const usersRepo = new UsersLocal()
console.log("User by date", usersRepo.userByDate(new Date()), " additional stirng ");
