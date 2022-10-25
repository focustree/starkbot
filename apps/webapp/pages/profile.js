import bodyParser from "body-parser";
import Link from "next/link";
import { promisify } from "util";
import Layout from "../components/layout";
import { sanitize } from "../lib/sanitize";
import { verifyToken } from "../lib/session";

import formStyles from "../styles/forms.module.css";
import utilStyles from "../styles/utils.module.css";

const API_URL = process.env.API_URL;
const getBody = promisify(bodyParser.urlencoded());


//  Check server-side the jwt is valid
export async function getServerSideProps({req, res}) {
    const token = verifyToken(req.cookies.token);
    
    if(token === null) {
        return {
            redirect: {
                destination: "/sign-in"
            }
        }
    }

    if(req.method === "POST") {

        //  Get the POST data
        await getBody(req, res);

        const editApi = await fetch(`${API_URL}/edit`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({old: req.body.old, password: req.body.password, confirm: req.body.confirm, token:  sanitize(req.cookies.token)}),
        });

        let result = await editApi.json();

        return {
            props: {
                status: result.status,
                message: result.message,
                token: token
            }
        }
    }
    return {
        props: {
            token: token
        }
    }
}

export default function Profile(props) {

    return (
        <Layout title="Profile" token={props.token}>
            <h1 className={utilStyles.headingXl}>Edit your profile</h1>

            {props.status ? (
                props.status === "success" ? (
                    <><p className={utilStyles.success}>{props.message}</p></>
                ) : (
                    <><p className={utilStyles.error}>{props.message}</p></>
                )
            ) : (<></>)}
            <form method="POST">
                <label>Old password:</label>
                <input type="password" name="old" />
                <label>New password:</label>
                <input type="password" name="password" />
                <label>Confirm new password:</label>
                <input type="password" name="confirm" />
                <input type="submit" value="Save" className={utilStyles.headingMd} />
            </form>
            <div className={formStyles.links}><Link href="/">&larr; Go back home</Link><Link href={`/dashboard`}>Go back to dashboard</Link></div>
        </Layout>
    );
}