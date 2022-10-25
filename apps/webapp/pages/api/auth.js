import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { getUserData } from "../../lib/accounts";

const KEY = process.env.JWT_KEY;

export default function (req, res) {
    return new Promise(async resolve => {
        if(req.method === "POST") {
            const {email, password, remember } = req.body;

            if(!email || !password) {
                return res.status(400).json({
                    status: "error",
                    message: "Request missing email or password",
                });
            }
            getUserData(email).then((user) => {
                if (!user) {
                    res.status(400).json({ status: "error", message: "Incorrect password or email"});
                }
                const {id, email, password} = user;
                bcrypt.compare(req.body.password, password).then(valid => {

                    if(valid) {
                        
                        const jwtData = {
                            id,
                            email,
                        };

                        jwt.sign(
                            jwtData,
                            KEY, {
                                expiresIn: 3600 * (remember ? 7*24 : 1)  // 7 days or 1 hour
                            },
                            (err, token) => {
                                res.status(200).json({
                                    success: true,
                                    token,
                                });
                            },
                        );
                    } else {
                        res.status(400).json({ status: "error", message: "Incorect password or email"});
                    }
                });
            })
        } else {
            return res.status(400).json({ status: "error", message: "Invalid method" })
        }

        return await resolve();
    });
}