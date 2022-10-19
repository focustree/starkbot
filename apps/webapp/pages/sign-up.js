import bodyParser from "body-parser";
import Link from "next/link";
import { promisify } from "util";
import Layout from "../components/layout";
import { addUser, isMailAvailable } from "../lib/accounts";
import { isMailValid, isPasswordValid } from "../lib/sanitize";

import styles from "../styles/forms.module.css";
import utilStyles from "../styles/utils.module.css";

const getBody = promisify(bodyParser.urlencoded());


//  Treat new requests
export async function getServerSideProps({ req, res }) {

    //  A new request to add a user arrived
    if (req.method === "POST") {

        //  Get the POST data
        await getBody(req, res);

        //  Ensure all fields are filled
        if (
            req.body.email !== undefined && 
            req.body.password !== undefined &&
            req.body.confirm !== undefined
        ) {

            // Check the email is correct
            if(isMailValid(req.body.email)) {
                //  The passwords must be the same
                if (req.body.password === req.body.confirm) {
                    //  Check if the email is already used
                    if( await isMailAvailable(req.body.email) ) {
                        //  Check password is valid
                        if(isPasswordValid(req.body.password)) {
                            addUser(req.body.email, req.body.password);

                            // Redirect the user to the sign-in page
                            res.statusCode = 302;
                            res.setHeader('Location', `/sign-in`);
                            return { props: {
                                status: "success",
                                message: "Account successfully created"
                                }
                            }
                        } else {
                            return {
                                props: {
                                    status: "error",
                                    message: "Password must contain at least one lower and upper char, a number a special char and be longer than 8 characters.",
                                    email: req.body.email
                                }
                            }
                        }
                    } else {
                        return {
                            props: {
                                status: "error",
                                message: "This email is already used."
                            }
                        }
                    }
                } else {
                    return {
                        props: {
                            status: "error",
                            message: "Passwords are not the same.",
                            email: req.body.email
                        }
                    }
                }
            } else {
                return {
                    props: {
                        status: "error",
                        message: "Please return a valid email"
                    }
                }
            }
        } else {
            return {
                props: {
                    status: "error",
                    message: "Please fill all the fields.",
                    email: req.body.email
                }
            }
        }
    }
    return { props: {
        status: "success"
    }}
}

export default function SignUp(props) {
    return (
        <Layout title="Sign-up">
            <h1 className={utilStyles.headingXl}>Create your Starknet account !</h1>
            {props.status === "error" ? (
                <>
                    <p className={utilStyles.error}>{props.message}</p>
                </>
            ): (<></>)}
            <form method="POST">
                <label htmlFor="email">Email</label>
                <input type="email" name="email" defaultValue={props.email ? props.email : ""} required />
                <label htmlFor="password">Password</label>
                <input type="password" name="password" required />
                <label htmlFor="confirm">Confirm password</label>
                <input type="password" name="confirm" required />
                <input type="submit" value="Submit" className={utilStyles.headingMd}/>
            </form>     
            <p className={styles.links}><Link href="/">&larr; Go back home</Link><Link href="/sign-in">I already have an account</Link></p>
        </Layout>
    );
}