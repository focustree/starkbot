import { checkCreds } from "../../lib/accounts";
import { isPasswordValid } from "../../lib/sanitize";
import { verifyToken } from "../../lib/session";

export default function (req, res) {
    return new Promise(async resolve => {
        //  Check the user is well logged
        const token = verifyToken(req.body.token);
        if(token === null) {
            return res.redirect(302, "/sign-in");
        }
        //  Ensure all the data have been sent
        if(req.method === "POST" && req.body.old && req.body.password && req.body.confirm) {
            //  Check equality of new passwords
            if(req.body.password === req.body.confirm) {
                //  Check password is valid
                if(isPasswordValid(req.body.password)) {
                    //  Verify the old password was the good one
                    const authenticated = await checkCreds(token.email, req.body.old);
                    if (authenticated) {
                        //  TODO
                        //  Update th password
                        res.status(200).json({status: "success", message: "Password changed."});
                    } else {
                        res.status(200).json({status: "error", message: "Wrong password."});
                    }
                } else {
                    return res.status(200).json({status: "error", message: "Password must contain at least one lower and upper char, a number a special char and be longer than 8 characters."});
                }                
            } else {
                return res.status(200).json({status: "error", message: "Passwords are not the same."});
            }
        } else {
            return res.status(200).json({status: "error", message: "Please fill all the fields."});
        }
        return await resolve();
    });
}