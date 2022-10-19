import { BaseGuild, Guild, OAuth2Guild } from "discord.js";
import { deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { useAppContext } from "..";

export interface RuleDoc {
    roleId: string;
    tokenAddress: string;
    minBalance: number;
    maxBalance: number;
}
export async function getRulesForGuild(guild: BaseGuild) {
    const rulesSnapshot = await getDocs(rulesOfGuild(guild.id));
    return rulesSnapshot.docs
}

export async function createRuleForGuild(guild: Guild, selectedRoleId: string, tokenAddress: string, minBalance: number, maxBalance: number) {
    let rule = doc(rulesOfGuild(guild.id))
    await setDoc(rule, {
        roleId: selectedRoleId,
        tokenAddress,
        minBalance,
        maxBalance,
    });
}

export async function getRuleForGuild(guild: Guild, id: string) {
    const ruleSnapshot = await getDoc(doc(rulesOfGuild(guild.id), id));
    return ruleSnapshot.data()
}

export async function deleteRuleForGuild(guild: Guild, id: string) {
    const ruleDocRef = doc(rulesOfGuild(guild.id), id);
    const rule = (await getDoc(ruleDocRef)).data();
    await deleteDoc(ruleDocRef);
    return rule
}

function rulesOfGuild(id: string) {
    return useAppContext().firebase.rulesOfGuild(id);
}