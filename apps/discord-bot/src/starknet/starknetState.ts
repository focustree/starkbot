export class StarknetState {
  users: Map<String, StarknetUserState> = new Map();

  updateUser(user: StarknetUserState) {
    this.users.set(user.walletAddress, user);
  }
}

interface StarknetUserState {
  walletAddress: String;
  discordId: String;
  ownedNFTs: Set<String>;
}
