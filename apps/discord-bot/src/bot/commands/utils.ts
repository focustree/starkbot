export function formatRule({ role, tokenAddress, minBalance, maxBalance, }:
    { role: string; tokenAddress: string; minBalance: number; maxBalance: number; }) {
    return `\`\`\`
    • Role: ${role}
    • Token Address: ${tokenAddress}
    • Min Balance: ${minBalance}
    • Max Balance: ${maxBalance}\`\`\``;
}

export function formatShortTokenAddress(tokenAddress: string) {
    return tokenAddress.slice(0, 6) + '...' + tokenAddress.slice(-4);
}
