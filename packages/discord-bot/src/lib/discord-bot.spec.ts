import { discordBot } from './discord-bot';

describe('discordBot', () => {
  it('should work', () => {
    expect(discordBot()).toEqual('discord-bot');
  });
});
