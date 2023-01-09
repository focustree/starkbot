import axios from 'axios';
import { DiscordGuild, DiscordMember, dynamoQueryResponse } from '../dynamodb/db-types';
import { defaultProvider, stark, uint256 } from 'starknet';
import { config } from '../configuration/config';
import { logger } from '../configuration/logger';
import { getItem, getTable, putItem } from '../dynamodb/dynamodb';

export async function fetchStarknetIds() {
  const guilds = await getTable("guild", {
    ExpressionAttributeNames: {
      "#g": "guild-id",
      "#n": "Name",
    },
    ProjectionExpression: "#g, #n",
  });
  let promiseList = [];

  for (const guild of guilds.data) {
    const prettyGuild = { id: guild["guild-id"]['S'], name: guild["Name"]['S']};
    await promiseList.push(prettyGuild);
  }

  await Promise.all(promiseList.map((arg) => fetchStarknetIdsForGuild(arg)));
}

async function fetchStarknetIdsForGuild(guild: DiscordGuild) {
  logger.info(`Fetching Starknet IDs for guild: ${guild.name}`);
  const dataGuild = await getItem("guild", { "guild-id": guild.id });
  const members: DiscordMember[] = dataGuild.data["Members"];
  
  for (const member of members) {
    const starknetId = await fetchStarknetIdsForMember(member.id);

    if (!!starknetId) {
      const queryResponse : dynamoQueryResponse = await putItem("starknet-id", {
        ...starknetId,
      });

      if(queryResponse.response) {
        logger.info(`${guild.name}: Added new starknet ID for ${member.username} (${starknetId['starknet-id']})`);
      }
    }
  }
}

async function fetchStarknetIdsForMember(discordMemberId: string) {
  try {
    const { data } = await axios.get(config.starknetIdIndexerUrl, {
      params: {
        field: config.discordType,
        verifier: config.verifierDecimalContractAddress,
        data: discordMemberId,
      },
    });
    if (!data.id) {
      return null;
    }
    const {
      result: [accountAddress],
    } = await defaultProvider.callContract({
      contractAddress: config.starknetIdContractAddress,
      entrypoint: 'ownerOf',
      calldata: stark.compileCalldata({
        ...uint256.bnToUint256(data.id),
      }),
    });
    return {
      accountAddress,
      discordMemberId,
      "starknet-id": data.id,
    };
  } catch (error) {
    // TODO THERE IS AN ERROR HERE ATM
    //logger.error(error);
    return null;
  }
}
