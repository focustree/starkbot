import { doc, getDocs, setDoc } from 'firebase/firestore';
import { useAppContext } from '..';
import { DiscordGuildDoc, StarknetIdDoc } from '../firebase';

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
  for (const [i, member] of members.docs.entries()) {
    // TODO: Actually fetch starknet id from the blockchain
    const starknetIdDoc: StarknetIdDoc = {
      accountAddress: `0x${i}`,
      discordMemberId: member.id,
      id: i,
    };
    await setDoc(doc(appContext.firebase.starknetIds, `${i}`), starknetIdDoc);
  }
}
