import jwt from "jsonwebtoken";
import { updatePassword } from "../../lib/accounts";
import { isPasswordValid } from "../../lib/sanitize";

const KEY = process.env.RST_KEY;

export default function (req, res) {
    return new Promise(async resolve => {
        if(req.method === "POST") {
            const {data, password, confirm } = req.body;

            try {
                const token = jwt.verify(data, KEY);

                if(password === confirm) {
                    if(isPasswordValid(password)) {
                        updatePassword(token.id, password);
                        return res.status(200).json({status: "updated", message: "Password has been reset !"});
                    } else {
                        return res.status(200).json({status: "error", message: "Password must contain at least one lower and upper char, a number a special char and be longer than 8 characters."});
                    }
                    
                } else {
                    res.status(400).json({status: "error", message: "Passswords are not the same."});
                }
            } catch (e) {
                res.status(404).json({status: "error", message: "Unauthorized"})
            }

        }
        res.status(400).json({status: "error", message: "Bad request"});

        return await resolve();
    });
}