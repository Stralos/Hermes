import moment from 'moment';
import Members from 'models/members';
import Member from 'models/member';
import Channels from 'models/channels';
import ChannelNames from 'models/channelNames';
import WeekDays from 'models/WeekDays';
import { WebClient, WebAPICallResult } from '@slack/client';
import getBreakfastSchedule from 'utils/breakfastUsers';

export default class BreakfastReminderScheduler {
  private web: WebClient
  
  constructor(web: WebClient) {
    this.web = web;
    this.getChannelByName = this.getChannelByName.bind(this);
    this.getSlackMembers = this.getSlackMembers.bind(this);
    this.sendReminderForBreakfast = this.sendReminderForBreakfast.bind(this);
    this.getUserNameWhoNeedsToBringBreakfast = this.getUserNameWhoNeedsToBringBreakfast.bind(this);
    this.getPersonalMessage = this.getPersonalMessage.bind(this);
    this.getChatMessage = this.getChatMessage.bind(this);
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

  private async getUserNameWhoNeedsToBringBreakfast(): Promise<string> {
    const nextMonday = moment().isoWeekday(1 + 7).format('YYYY-MM-DD');
    const schedule = await getBreakfastSchedule();

    const nextPersonToBringBreakfast = schedule.find(time => moment(time.date).isSame(nextMonday));

    if (nextPersonToBringBreakfast == null) {
      throw Error(`Person to bring breakfast for ${nextMonday} not found`);
    }

    return nextPersonToBringBreakfast.name;
  }

  private getChatMessage(userId: string): string {
    if (moment().isoWeekday() === WeekDays.FRIDAY) {
      return `Primenu, kad sekantį pirmadienį yra <@${userId}> eilė pasirūpinti pusryčiais`;
    }
    return `Sekantį pirmadienį <@${userId}> eilė pasirūpinti pusryčiais.`
  }

  private getPersonalMessage(userId: string): string {
    if (moment().isoWeekday() === WeekDays.FRIDAY) {
      return `Labas, <@${userId}>, primenu, kad ateinantį pirmadienį - tavo eilė atnešti pusryčius.`;
    }

    return `Labas, <@${userId}>, sekantį pirmadienį tavo eilė atnešti pusryčius`
  }


  public async sendReminderForBreakfast(): Promise<void> {
    try {
      debugger;
      const members = await this.getSlackMembers();
      const breakfastUserName = await this.getUserNameWhoNeedsToBringBreakfast();
      const breakfastUser = members.find(member => member.real_name === breakfastUserName);
      if (breakfastUser == null) {
        throw Error(`User [${breakfastUserName}] not found in slack users`);
      }
      const channel = await this.getChannelByName(ChannelNames.GENERAL);
      
      this.web.chat.postMessage({ 
        channel: channel.id,
        text: this.getChatMessage(breakfastUser.id)
      });      

      const breakfestUserChannel = await <any> this.web.im.open({ user: breakfastUser.id })
      this.web.chat.postMessage({ 
        channel: breakfestUserChannel.channel.id,
        text: this.getPersonalMessage(breakfastUser.id)
      });
    } catch(e) {
      console.log(e);
    }
  }
}
