import {
  DiscordGuild,
  DiscordMember,
  dynamoQueryResponse,
} from '../../../models/types';
import { logger } from '../../../configuration/logger';
import { getItem, getTable, putItem } from '../../../models/dynamoQueries';
import axios from 'axios';

async function fetchStarknetIdsForMember(member) {
  return (await axios({
    method: 'get',
    url: 'https://fetchSID/',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      member
    }),
  }));
}

export async function fetchStarknetIds() {
  const guilds = await getTable('guild', {
    ExpressionAttributeNames: {
      '#g': 'guild-id',
      '#n': 'Name',
    },
    ProjectionExpression: '#g, #n',
  });
  let promiseList = [];

  for (const guild of guilds.data) {
    const prettyGuild = {
      id: guild['guild-id']['S'],
      name: guild['Name']['S'],
    };
    await promiseList.push(prettyGuild);
  }

  await Promise.all(promiseList.map((arg) => fetchStarknetIdsForGuild(arg)));
}

async function fetchStarknetIdsForGuild(guild: DiscordGuild) {
  logger.info(`Fetching Starknet IDs for guild: ${guild.name}`);
  const dataGuild = await getItem('guild', { 'guild-id': guild.id });
  const members: DiscordMember[] = dataGuild.data['Members'];

  for (const member of members) {
    const starknetId = await fetchStarknetIdsForMember(member.id);

    if (!!starknetId) {
      const queryResponse: dynamoQueryResponse = await putItem('starknet-id', {
        ...starknetId,
      });

      if (queryResponse.response) {
        logger.info(
          `${guild.name}: Added new starknet ID for ${member.username} (${starknetId['starknet-id']})`
        );
      }
    }
  }
}


