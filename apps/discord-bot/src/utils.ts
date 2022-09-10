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