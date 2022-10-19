import jwt from "jsonwebtoken";
import Layout from "../components/layout";

import utilStyles from "../styles/utils.module.css";
import formStyles from "../styles/forms.module.css";

import Link from "next/link";
import { sanitize } from "../lib/sanitize";

const RST_KEY = process.env.RST_KEY;

export async function getServerSideProps({req, res, query}) {
    if(req.method === "GET") {

        if (query.l) {
            const data = query.l;

            try {
                const token = jwt.verify(data, RST_KEY);
                const id = token.id;

                return {
                    props: {
                        status: "success",
                        data,
                        id
                    }
                }
            } catch(e) {
                return {
                    props: {
                        status: "bad"
                    }
                }
            }

        }
    }
    return {
        props: {
            status: "bad"
        }
    }
}

export default function ResetPassword(props) {

    let updated = false;

    async function onSubmitHandler(e) {

        e.preventDefault();
        
        const data = sanitize(document.getElementById("token").value);
        const password = document.getElementById("password").value;
        const confirm = document.getElementById("confirm").value;
        
        const resetApi = await fetch(`/api/update-password`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({data, password, confirm}),
        });
        let result = await resetApi.json();

        console.log(result);
        if (result.status === "updated") {
            location.replace('/updated')
        }
        if(result.status === "error") {
            errors = document.getElementById("errors");
            errors.innerText =result.message;
            errors.style.visibility = "visible";
        }

    };

    if(props.status === "bad") {
        return (
            <Layout>
                <h1 className={utilStyles.heading2Xl}>Invalid link</h1>
                <Link href="/">&larr; Go back home</Link>
            </Layout>
        )
    }
    if(props.status === "success") {
        return (
            <Layout>
                <h1 className={utilStyles.heading2Xl}>Reset your password</h1>

                <p style={{visibility: "hidden"}} id="errors" className={utilStyles.error}>aaa</p>
                <form method="POST" className={formStyles.form} onSubmit={onSubmitHandler}>
                  <label htmlFor="password" className={utilStyles.headingMd}>New password</label><input type="password" id="password" name="password" required />
                    <label htmlFor="password" className={utilStyles.headingMd}>Confirm password</label><input type="password" id="confirm" name="confirm" required />
                    <input type="hidden" id="token" value={props.data} />
                    <input type="submit" value="Submit" className={utilStyles.headingMd} />
                </form>
              <Link href="/">&larr; Go back home</Link>
            </Layout>
        )
    }
}