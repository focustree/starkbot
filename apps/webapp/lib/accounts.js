import { hashPass, checkPass } from "./crypto";

//  All functions have to be called with await or use then

export async function addUser(email, password) {

    hashPass(password).then((hash) => {
        //  TODO
        //  Add a new user in the database with 0 bot
    });
}

export async function isMailAvailable(email) {
    // TODO
    // Query the database to find if an entry with email is already present
    const available = true; // To remove

    return available;
}

export async function getUserData(email) {
    //  TODO 
    //  Return User object

    const user = { id: "abcd1234", email, password: "$2b$10$CCnIdPDNa./kz2JMlGSOjOxxxEXrdLshqC98JwDoAzblakV96UW/G" } // Hash('a')
    return user
}

export async function checkCreds(email, password) {

    //  TODO
    //  Get the user id and the hash of password in the database and compare it with the current hash of password.
    //  In case of success, regenerate a secret token

    const hash = (await getUserData(email)).password;
    const data = await checkPass(password, hash);

    return data;
}


export async function updatePassword(userId, password) {
    //  TODO
    //  Update the password for the user
}

export async function getBotsData(userId) {
    //  TODO
    //  Query the database to get bots and their data

    return [{id:"key1-abcd1234", key:"KEY1"}, {id:"key2-abcd1234", key:"KEY2"}]
}