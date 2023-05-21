import axios from 'axios';
import { defaultProvider, stark, uint256 } from 'starknet';
import { config } from '../../configuration/config';

export async function fetchStarknetIdsForMember(discordMemberId: string) {
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
        'starknet-id': data.id,
      };
    } catch (error) {
      // TODO THERE IS AN ERROR HERE ATM
      //logger.error(error);
      return null;
    }
  }