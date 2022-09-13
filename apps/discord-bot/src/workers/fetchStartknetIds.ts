import { doc, getDocs, setDoc } from 'firebase/firestore';
import axios from 'axios';
import { useAppContext } from '..';
import { DiscordGuildDoc } from '../models/firebase';
import { defaultProvider, stark, uint256 } from 'starknet';
import { config } from '../configuration/config';
import { logger } from '../configuration/logger';

export async function fetchStarknetIds() {
  const appContext = useAppContext();
  const guilds = await getDocs(appContext.firebase.guilds);
  for (const guild of guilds.docs) {
    await fetchStarknetIdsForGuild(guild.data());
  }
}

async function fetchStarknetIdsForGuild(guild: DiscordGuildDoc) {
  logger.info(`Fetching Starknet IDs for guild: ${guild.name}`);
  const appContext = useAppContext();
  const members = await getDocs(appContext.firebase.membersOfGuild(guild.id));
  for (const member of members.docs) {
    const starknetId = await fetchStarknetIdsForMember(member.id);
    if (!!starknetId) {
      await setDoc(
        doc(appContext.firebase.starknetIds, `${starknetId.id}`),
        starknetId
      );
    }
  }
}

async function fetchStarknetIdsForMember(discordMemberId: string) {
  try {
    const { data } = await axios.get(config.starknetIdIndexerUrl, {
      params: {
        type: config.discordType,
        verifier: config.verifierDecimalContractAddress,
        data: discordMemberId,
      },
    });
    if (!data.token_id) {
      return null;
    }
    const {
      result: [accountAddress],
    } = await defaultProvider.callContract({
      contractAddress: config.starknetIdContractAddress,
      entrypoint: 'owner_of',
      calldata: stark.compileCalldata({
        ...uint256.bnToUint256(data.token_id),
      }),
    });
    return {
      accountAddress,
      discordMemberId,
      id: data.token_id,
    };
  } catch (error) {
    // TODO THERE IS AN ERROR HERE ATM
    // logger.error(error);
    return null;
  }
}
