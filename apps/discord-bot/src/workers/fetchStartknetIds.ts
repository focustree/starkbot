import { doc, getDocs, setDoc } from 'firebase/firestore';
import axios from 'axios';
import { useAppContext } from '..';
import { DiscordGuildDoc, StarknetIdDoc } from '../firebase';
import { defaultProvider, stark, uint256 } from 'starknet';

export async function fetchStarknetIds() {
  const appContext = useAppContext();
  const guilds = await getDocs(appContext.firebase.guilds);
  for (const guild of guilds.docs) {
    await fetchStarknetIdsForGuild(guild.data());
  }
}

async function fetchStarknetIdsForGuild(guild: DiscordGuildDoc) {
  console.log('Fetching Starknet IDs for guild:', guild.name);

  const appContext = useAppContext();
  const members = await getDocs(appContext.firebase.membersOfGuild(guild.id));
  for (const member of members.docs) {
    // TODO: Actually fetch starknet id from the blockchain
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
    const { data, status } = await axios.get(
      'https://indexer.starknet.id/fetch_tokens_id',
      {
        params: {
          type: '28263441981469284', // discord
          verifier:
            '218957698842707292111176682338308570428481820353543328403027153649547919416', // verifier contract address
          data: discordMemberId, // discord member id
        },
      }
    );
    if (!data.token_id) {
      return null;
    }
    const {
      result: [accountAddress],
    } = await defaultProvider.callContract({
      contractAddress:
        '0x033233531959c1da39c28daf337e25e2deadda80ce988290306ffabcd735ccbd',
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
    console.error(error);
    return null;
  }
}
