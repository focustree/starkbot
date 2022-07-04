export const alwaysTrue = true;

export function sleep(s: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, s * 1000);
  });
}

export function getConfig(env: string) {
  const value = process.env[env];
  if (!value) {
    throw new Error(`${env} is not set`);
  }
  return value;
}
