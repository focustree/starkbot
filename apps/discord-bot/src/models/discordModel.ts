export interface DiscordGuildDoc {
    id: string;
    name: string;
}

export interface DiscordMemberDoc {
    id: string;
    username: string;
    roleIds: Array<string>;
}

export interface DiscordRoleDoc {
    id: string;
    name: string;
}