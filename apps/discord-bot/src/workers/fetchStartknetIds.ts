import { doc, getDocs, setDoc } from 'firebase/firestore';
import axios from 'axios';
import { useAppContext } from '..';
import { DiscordGuildDoc, StarknetIdDoc } from '../firebase';
import { defaultProvider, stark, uint256 } from 'starknet';

const defaultStarknetIds: { [discordMemberId: string]: StarknetIdDoc } = {
  // Gabin
  '244940825572802560': {
    id: 2,
    accountAddress:
      '0x0367c0c4603a29Bc5aCA8E07C6A2776D7C0d325945aBB4f772f448b345Ca4Cf7',
    discordMemberId: '244940825572802560',
  },
  // Laurent
  '986383996227313725': {
    id: 3,
    accountAddress:
      '0x074d4033D6d80fB7856A46046449F0b3b247E773284a279b293012d21d8F0116',
    discordMemberId: '986383996227313725',
  },
  // JB
  '946041152082182164': {
    id: 4,
    accountAddress:
      '0x017ed6C1B93d436003BC28f57A6992a8b0481dff686a1B88e8469C6aA6C78abf',
    discordMemberId: '946041152082182164',
  },
};

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
  if (Object.keys(defaultStarknetIds).includes(discordMemberId)) {
    return defaultStarknetIds[discordMemberId];
  }

  try {
    const { data, status } = await axios.get(
      'http://indexer.starknet.id:8080/fetch_token_id',
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
