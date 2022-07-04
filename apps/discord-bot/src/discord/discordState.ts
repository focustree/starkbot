import { Mutex } from 'async-mutex';
import { Guild, GuildMember } from 'discord.js';

export class DiscordState {
  private _mutex: Mutex;
  private _guilds: Map<String, DiscordGuildState>;

  async updateGuildMembers(guild: Guild, members: Map<String, GuildMember>) {
    await this._mutex.runExclusive(async () => {
      const doesGuildExist = this._guilds[guild.id];
      if (!doesGuildExist) {
        this._guilds[guild.id] = new DiscordGuildState();
      }
      this._guilds[guild.id].updateMembers(members);
    });
  }

  guilds(): Map<String, DiscordGuildState> {
    return this._guilds;
  }
}

export class DiscordGuildState {
  private _mutex: Mutex;
  private _members: Map<String, GuildMember>;

  async updateMembers(members: Map<String, GuildMember>) {
    await this._mutex.runExclusive(() => {
      this._members = members;
    });
  }

  members(): Map<String, GuildMember> {
    return this._members;
  }
}
