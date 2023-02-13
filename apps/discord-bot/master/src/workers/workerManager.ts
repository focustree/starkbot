import { applyRules } from "./applyRules";
import { fetchDiscordMembers } from "./fetchDiscordMembers";
import { fetchStarknetIds } from "./fetchStartknetIds";

export async function doLoopOnWorkers() {
    await Promise.all([
        schedule(fetchDiscordMembers, 10),
        schedule(fetchStarknetIds, 10),
        schedule(applyRules, 10),
    ]);
}
async function schedule(fn: () => void, s: number) {
    while (true) {
        await fn();
        await sleep(s);
    }
}

function sleep(s: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, s * 1000);
    });
}