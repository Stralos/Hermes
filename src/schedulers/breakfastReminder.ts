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

  private getChatMessage(userIdentifier: string): string {
    if (moment().isoWeekday() === WeekDays.FRIDAY) {
      return `Primenu, kad kitą pirmadienį yra ${userIdentifier} eilė pasirūpinti pusryčiais`;
    }
    return `Kitą pirmadienį ${userIdentifier} eilė pasirūpinti pusryčiais.`
  }

  private getPersonalMessage(userIdentifier: string): string {
    if (moment().isoWeekday() === WeekDays.FRIDAY) {
      return `Labas, ${userIdentifier}, primenu, kad kitą pirmadienį - tavo eilė atnešti pusryčius.`;
    }

    return `Labas, ${userIdentifier}, kitą pirmadienį tavo eilė atnešti pusryčius`
  }

  private static formatId(id: string): string {
    return `<@${id}>`;
  }

  public async sendReminderForBreakfast(): Promise<void> {
    try {
      const channel = await this.getChannelByName(ChannelNames.GENERAL);
      const breakfastUserName = await this.getUserNameWhoNeedsToBringBreakfast();

      if (!breakfastUserName.replace(/-/g, '').length) {
        /**
         * instead of a user name ---- was provided
         * we will send a message that no one needs to bring food
         * for the next week;
         * We will send it just on monday to avoid spam.
         */
        if (moment().isoWeekday() === WeekDays.MONDAY) {
          this.web.chat.postMessage({ 
            channel: channel.id,
            text: `Pagal sąrašą, kitą pirmadienį pusryčių nebus. Gerų švenčių !`,
          });
        }        
        return;
      }

      const members = await this.getSlackMembers();
      const breakfastUser = members.find(member => member.real_name === breakfastUserName);

      if (breakfastUser == null) { 
        /* we where not able to map user real name
        ** with slack, so we will send the message to general
        ** using the provided user name.
        */
        this.web.chat.postMessage({ 
          channel: channel.id,
          text: this.getChatMessage(breakfastUserName)
        });

        throw Error(`User [${breakfastUserName}] not found in slack users`);
      }
      
      this.web.chat.postMessage({ 
        channel: channel.id,
        text: this.getChatMessage(BreakfastReminderScheduler.formatId(breakfastUser.id))
      });      

      const breakfestUserChannel = await <any> this.web.im.open({ user: breakfastUser.id })
      this.web.chat.postMessage({ 
        channel: breakfestUserChannel.channel.id,
        text: this.getPersonalMessage(BreakfastReminderScheduler.formatId(breakfastUser.id))
      });
    } catch(e) {
      console.log(e);
    }
  }
}
