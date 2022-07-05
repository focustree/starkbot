import fs from "fs";
import {
  Account,
  Contract,
  ec,
  Provider,
  json,
  number,
} from "starknet";

/// Creating new account

const starkKeyPair = ec.genKeyPair();
const starkKeyPub = ec.getStarkKey(starkKeyPair);

const compiledAccount = json.parse(
  fs.readFileSync("./contract/account.json").toString("ascii")
);
const accountResponse = await defaultProvider.deployContract({
  contract: compiledAccount,
  addressSalt: starkKeyPub,
});

const account = new Account(provider, accountResponse.address, starkKeyPair);

/// Defining provider

const provider = new Provider({
    baseUrl: 'http://127.0.0.1:5050',
    feederGatewayUrl: 'http://127.0.0.1:5050',
    gatewayUrl: 'http://127.0.0.1:5050',
});

/// Deploying Starknet ID smart contract on-chain

const compiled_starknet_id = json.parse(
  fs.readFileSync("./contract/starknet_id.json").toString("ascii")
);

const starknet_id_response = await provider.deployContract({
  contract: compiled_starknet_id,
});

console.log("Waiting for Tx to be Accepted on Starknet DevNet - Straknet ID Deployment...");
await provider.waitForTransaction(starknet_id_response.transaction_hash);

const starknet_id_contract_address = starknet_id_response.address;
const starknet_id_contract = new Contract(compiled_starknet_id.abi, starknet_id_contract_address);

/// Deploying NFT smart contract on-chain

const compiled_nft = json.parse(
  fs.readFileSync("./contract/nft.json").toString("ascii")
);

const nft_response = await provider.deployContract({
  contract: compiled_nft,
});

console.log("Waiting for Tx to be Accepted on Starknet DevNet - NFT Deployment...");
await provider.waitForTransaction(nft_response.transaction_hash);

const nft_contract_address = nft_response.address;
const nft_contract = new Contract(compiled_nft.abi, nft_contract_address);

/// Minting NFT for the user we created

const { transaction_hash: mint_nft_TxHash } = await nft_contract.mint(
  account.address,
  1234
);
console.log(`Waiting for Tx to be Accepted on Starknet - Minting NFT...`);
await provider.waitForTransaction(mint_nft_TxHash);

/// Minting ID for the user we already created

const { transaction_hash: mint_starknet_id_TxHash } = await starknet_id_contract.mint(
  account.address,
  1234
);
console.log(`Waiting for Tx to be Accepted on Starknet - Minting Starknet ID...`);
await provider.waitForTransaction(mint_starknet_id_TxHash);