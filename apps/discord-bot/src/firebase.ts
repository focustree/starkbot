import { initializeApp } from 'firebase/app';
import {
  collection,
  CollectionReference,
  connectFirestoreEmulator,
  DocumentData,
  Firestore,
  getFirestore,
} from 'firebase/firestore';
import { Config } from './config';

export function initFirebase(config: Config) {
  const app = initializeApp(config.firebaseConfig);
  const firestore = getFirestore(app);
  if (config.env === 'local') {
    connectFirestoreEmulator(firestore, 'localhost', 8080);
  }

  const guilds = createCollection<DiscordGuildDoc>(firestore, 'discordGuilds');
  const membersOfGuild = (guildId: string) =>
    createCollection<DiscordMemberDoc>(
      firestore,
      `discordGuilds/${guildId}/members`
    );
  const rolesOfGuild = (guildId: string) =>
    createCollection<DiscordRoleDoc>(
      firestore,
      `discordGuilds/${guildId}/roles`
    );
  const rulesOfGuild = (guildId: string) =>
    createCollection<RuleDoc>(firestore, `discordGuilds/${guildId}/rules`);
  const starknetIds = createCollection<StarknetIdDoc>(firestore, 'starknetIds');
  const starknetAccounts = createCollection<StarknetAccountDoc>(
    firestore,
    'starknetAccounts'
  );
  const tokensOfAccount = (accountAddress: string) =>
    createCollection<TokenDoc>(
      firestore,
      `starknetAccounts/${accountAddress}/tokens`
    );

  return {
    app,
    firestore,
    guilds,
    membersOfGuild,
    rolesOfGuild,
    rulesOfGuild,
    starknetIds,
    starknetAccounts,
    tokensOfAccount,
  };
}

export type Firebase = ReturnType<typeof initFirebase>;

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

export interface RuleDoc {
  roleId: string;
  tokenAddress: string;
}

export interface StarknetIdDoc {
  id: number;
  accountAddress: string;
  discordMemberId: string;
}

export interface StarknetAccountDoc {
  address: string;
}

export interface TokenDoc {
  address: string;
  balance: number;
}

// This is just a helper to add the type to the db responses
const createCollection = <T = DocumentData>(
  firestore: Firestore,
  collectionName: string
) => {
  return collection(firestore, collectionName) as CollectionReference<T>;
};
