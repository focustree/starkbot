import { getBotsData } from "../../lib/accounts";
import { verifyToken } from "../../lib/session";

export default async function handler(req, res) {

    if(!req.cookies.token) {
        res.status(401).json({status: "error", message: "Please login"});
    }
    const token = verifyToken(req.cookies.token);
    if(token === null) {
        res.status(401).json({status: "error", message: "Please login"});
    }
    getBotsData(token.id).then((data) => {
        data ? res.status(200).send(data) : res.status(400).send()
    })
}