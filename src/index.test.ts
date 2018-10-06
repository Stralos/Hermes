import { WebClient } from '@slack/client';
jest.mock('@slack/client');

describe('test', () => {
  it('has to work!', async () => {
    const a = new WebClient('key');
    const b = await a.conversations.list();
    expect(b).toEqual({
      ok: true,
      channels: []
    });
  })
});