export function getConfig(env: string) {
  const value = process.env[env];
  if (!value) {
    throw new Error(`${env} is not set`);
  }
  return value;
}

export async function schedule(fn: () => void, s: number) {
  while (true) {
    await fn();
    await sleep(s);
  }
}

export function sleep(s: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, s * 1000);
  });
}

export function formatRule({
  role,
  tokenAddress,
  minBalance,
  maxBalance,
}: {
  role: string;
  tokenAddress: string;
  minBalance: number;
  maxBalance: number;
}) {
  return `\`\`\`
  • Role: ${role}
  • Token Address: ${tokenAddress}
  • Min Balance: ${minBalance}
  • Max Balance: ${maxBalance}\`\`\``;
}

export function formatShortTokenAddress(tokenAddress: string) {
  return tokenAddress.slice(0, 6) + '...' + tokenAddress.slice(-4);
}
