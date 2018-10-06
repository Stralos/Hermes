import { WebAPICallResult } from '@slack/client';
import Channels from '../../..//models/channels';

class Conversations {
  constructor() {
    this.list = this.list.bind(this);
  }

  public async list(): Promise<WebAPICallResult & Channels> {
    return {
      ok: true,
      channels: []
    };
  }
}

export class WebClient {
  private key: string;
  public conversations: Conversations;

  constructor(key: string) {
    this.key = key;
    this.conversations = new Conversations();
  }
}