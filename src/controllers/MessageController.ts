import { RTMClient } from '@slack/client';

export default class Messinger {
  private readonly rtm :Readonly<RTMClient>
  private get botId(): string {
    return `<@${this.rtm.activeUserId}>`;
  }

  constructor(rtm: RTMClient) {
    this.rtm = rtm;
    this.sendMessage = this.sendMessage.bind(this);
  }

  public async sendMessage(event: any): Promise<void> {
    console.log(event);
    if (!event.text.includes(this.botId)) {
      return;
    }

    this.rtm.sendMessage('What is up man!!', event.channel);
  }
}