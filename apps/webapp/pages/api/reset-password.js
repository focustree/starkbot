import { getUserData } from "../../lib/accounts";
import jwt from "jsonwebtoken";

const KEY = process.env.RST_KEY;

export default function handler(req, res) {
    if (req.method === "POST" && req.body.email) {
        const { email } = req.body;

        //  Create a JWT to validate the link

        const id = getUserData(email);
        const jwtData = {
            id,
            email,
        };

        jwt.sign(
            jwtData,
            KEY, {
                expiresIn: 10*60  // 10 minutes
            },
            (err, token) => {

                //  TODO
                //  Send an email with the url /reset?l=<token>

                console.log("TOKEN: " + token);
                res.status(200).json({
                    success: true,
                });
            },
        );
        


        res.redirect(302, "/");

    } else {
        res.redirect(300, "/forgotten?err=no-mail");
    }
}