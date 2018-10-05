export class WebClient {
  private key: string;
  public conversations = {
    async list() {
      return 1;
    }
  }

  constructor(key: string) {
    this.key = key;
  }
}