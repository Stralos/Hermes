import moment from 'moment';
import Members from 'models/members';
import Member from 'models/member';
import Channels from 'models/channels';
import ChannelNames from 'models/channelNames';
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
    const nextMonday = moment().isoWeekday(1 + 7).format('YYYY/MM/DD');
    const schedule = await getBreakfastSchedule();

    const nextPersonToBringBreakfast = schedule.find(time => moment(time.date).isSame(nextMonday));

    if (nextPersonToBringBreakfast == null) {
      throw Error(`Person to bring breakfast for ${nextMonday} not found`);
    }

    return nextPersonToBringBreakfast.name;
  }


  public async sendReminderForBreakfast(): Promise<void> {
    try {
      const members = await this.getSlackMembers();
      const breakfastUserName = await this.getUserNameWhoNeedsToBringBreakfast();
      const breakfastUser = members.find(member => member.real_name === breakfastUserName);
      if (breakfastUser == null) {
        throw Error(`User [${breakfastUserName}] not found in slack users`);
      }
      const channel = await this.getChannelByName(ChannelNames.GENERAL);
      
      this.web.chat.postMessage({ 
        channel: channel.id,
        text: `<@${breakfastUser.id}> needs to bring food next time!`
      });

      const breakfestUserChannel = await <any> this.web.im.open({ user: breakfastUser.id })
      this.web.chat.postMessage({ 
        channel: breakfestUserChannel.channel.id,
        text: `Hey, <@${breakfastUser.id}>, you need to bring food for the next monday`
      });
    } catch(e) {
      console.log(e);
    }
  }
}

