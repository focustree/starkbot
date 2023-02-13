import { logger } from '../configuration/logger';


// mutex to lock db access when it is modified
export let compromisedDB = [];

export function setCPDB(guild: string, value: boolean) {
    compromisedDB[guild] = value;
}
  
export function getCPDB(guild: string) {
    return compromisedDB[guild];
}


export function printError(err) {
    if(err) {
      logger.error(err);
    }
}