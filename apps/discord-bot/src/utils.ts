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
  minNFT,
  maxNFT,
}: {
  role: string;
  tokenAddress: string;
  minNFT: number;
  maxNFT: number;
}) {
  return `\`\`\`
  • Role: ${role}
  • Token Address: ${tokenAddress}\`\`\``;
}
