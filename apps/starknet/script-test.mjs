import fs from "fs";
import {
  Account,
  Contract,
  ec,
  Provider,
  json,
  number,
  stark,
  shortString,
  uint256
} from "starknet";

/// Defining provider
console.log("Defining provider");

const provider = new Provider({
  baseUrl: 'http://127.0.0.1:5050',
  feederGatewayUrl: 'http://127.0.0.1:5050',
  gatewayUrl: 'http://127.0.0.1:5050',
});

/// Creating new account
/// console.log("Creating new account");

/*const starkKeyPair = ec.genKeyPair();
const starkKeyPub = ec.getStarkKey(starkKeyPair);*/

const starkKeyPair = "0x12a3d6c43960b3584038485740e0176b";
const starkKeyPub = "0x5af3e5be5a80a26d10201d8e64b10fd9fc0a34063567bab8cdc6d72628e525d";
const account_address = "0x3d5cf3f090408f45105e22d726dfbd2306a30780bf86c31f91fd62119118662"

/*
const compiledAccount = json.parse(
  fs.readFileSync("./contract/account.json").toString("ascii")
);

console.log("Deploying account contract...")

const account_data = stark.compileCalldata({
  //public_key: shortString.encodeShortString(starkKeyPub),
  public_key: starkKeyPub
});

const accountResponse = await provider.deployContract({
  contract: compiledAccount,
  addressSalt: starkKeyPub,
  constructorCalldata: account_data,
});

await provider.waitForTransaction(accountResponse.transaction_hash);

console.log(accountResponse.address);

console.log("Creating contract for account...")
const accountContract = new Contract(
  compiledAccount.abi,
  accountResponse.address
);

console.log("initializing contract ...");

//const initializeResponse = await accountContract.initialize(starkKeyPub, "0");

//await provider.waitForTransaction(initializeResponse.transaction_hash);

*/

console.log("Getting user account");

const account = new Account(provider, account_address, starkKeyPair);

/// Deploying Starknet ID smart contract on-chain
console.log("Deploying Starknet ID smart contract on-chain")

const compiled_starknet_id = json.parse(
  fs.readFileSync("./contract/starknet_id.json").toString("ascii")
);

const starknet_id_response = await provider.deployContract({
  contract: compiled_starknet_id,
});

console.log("Waiting for Tx to be Accepted on Starknet DevNet - Starknet ID Deployment...");
await provider.waitForTransaction(starknet_id_response.transaction_hash);

const starknet_id_contract_address = starknet_id_response.address;
const starknet_id_contract = new Contract(compiled_starknet_id.abi, starknet_id_contract_address);

/// Deploying NFT smart contract on-chain
console.log("Deploying NFT smart contract on-chain")

const compiled_nft = json.parse(
  fs.readFileSync("./contract/nft.json").toString("ascii")
);

const constructor_data = stark.compileCalldata({
  name: shortString.encodeShortString("NFT identity"),
  symbol: shortString.encodeShortString("nft"),
  owner: account.address
});

const nft_response = await provider.deployContract({
  contract: compiled_nft,
  constructorCalldata : constructor_data
});

console.log("Waiting for Tx to be Accepted on Starknet DevNet - NFT Deployment...");
await provider.waitForTransaction(nft_response.transaction_hash);

console.log("Defining contract");

const nft_contract_address = nft_response.address;
const nft_contract = new Contract(compiled_nft.abi, nft_contract_address, account);

console.log(nft_contract_address);
console.log(account.address);

console.log("NFT contract successfully deployed");

/// Minting NFT for the user we created
console.log("Minting NFT for the user we created");

const { transaction_hash: mint_nft_TxHash } = await nft_contract.mint(
  account.address,
  uint256.bnToUint256(1234)
);
console.log(`Waiting for Tx to be Accepted on Starknet - Minting NFT...`);
await provider.waitForTransaction(mint_nft_TxHash);

/// Minting ID for the user we already created
console.log("Minting ID for the user we already created");

/*const minting_id_data = stark.compileCalldata({
  tokenId: uint256.bnToUint256(1234)
});

const { transaction_hash: mint_starknet_id_TxHash } = await starknet_id_contract.invoke("mint", [minting_id_data]);
console.log(`Waiting for Tx to be Accepted on Starknet - Minting Starknet ID...`);
await provider.waitForTransaction(mint_starknet_id_TxHash);
*/