export interface DiscordGuild {
    id: string;
    name: string;
}

export interface DiscordMember {
    id: string;
    username: string;
    roleIds: Array<string>;
}

export interface DiscordRole {
    id: string;
    name: string;
}

export interface DiscordRule {
    roleId: string;
    tokenAddress: string;
    minBalance: number;
    maxBalance: number;
}

export interface StarknetId {
    id: number;
    accountAddress: string;
    discordMemberId: string;
}

export interface StarknetAccount {
    address: string;
}

export interface Token {
    address: string;
    balance: number;
}