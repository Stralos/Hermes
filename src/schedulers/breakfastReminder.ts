import Members from 'models/members';
import Member from 'models/member';
import Channels from 'models/channels';
import ChannelNames from 'models/channelNames';
import { WebClient, WebAPICallResult } from '@slack/client';

export default class BreakfastReminderScheduler {
  private web: WebClient
  
  constructor(web: WebClient) {
    this.web = web;
    this.getChannelByName = this.getChannelByName.bind(this);
    this.getSlackMembers = this.getSlackMembers.bind(this);
    this.sendReminderForBreakfast = this.sendReminderForBreakfast.bind(this);
    this.getUserNameWhoNeedsToBringBreakfest = this.getUserNameWhoNeedsToBringBreakfest.bind(this);
  }

  private async getChannelByName(name: string) {
    const result = <Channels & WebAPICallResult> await this.web.conversations.list();
    const channel = result.channels.find(channel => channel.name === name);
    
    if (channel == null) {
      throw Error(`channel with name [${name}] not found !`);
    }
  
    return channel;
  };

  private async getSlackMembers(): Promise<Member[]> {
    const result = <Members & WebAPICallResult> await this.web.users.list();
    return result.members;
  }

  private async getUserNameWhoNeedsToBringBreakfest(): Promise<string> {
    return 'Paulius';
  }


  public async sendReminderForBreakfast(): Promise<void> {
    try {
      const members = await this.getSlackMembers();
      const breakfestUserName = await this.getUserNameWhoNeedsToBringBreakfest();
      const breakfestUser = members.find(member => member.real_name === breakfestUserName);
      if (breakfestUser == null) {
        throw Error(`User [${breakfestUserName}] not found in slack users`);
      }
      const channel = await this.getChannelByName(ChannelNames.GENERAL);
      this.web.chat.postMessage({ 
        channel: channel.id,
        text: `<@${breakfestUser.id}> needs to bring food next time!`
      });
    } catch(e) {
      console.log(e);
    }
  }
}

