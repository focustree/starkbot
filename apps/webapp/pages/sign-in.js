import Cookies from "js-cookie";
import Link from "next/link";
import Layout from "../components/layout";

import jwt from "jsonwebtoken";

import formStyles from "../styles/forms.module.css";
import utilStyles from "../styles/utils.module.css"
import { sanitize } from "../lib/sanitize";

export default function SignIn( props ) {

    async function onSubmitHandler(e) {

        e.preventDefault();
        
        const email = sanitize(document.getElementById("email").value);
        const password = document.getElementById("password").value;
        const remember = document.getElementById("remember").checked;
        
        const loginApi = await fetch(`/api/auth`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email, password, remember}),
        });
        let result = await loginApi.json();
        if (result.success && result.token) {
            remember ? Cookies.set('token', result.token, {expires: 7}) : Cookies.set('token', result.token);
              const id = jwt.decode(result.token, {complete: true}).payload.id;
            location.replace(`/dashboard`);
        } else {
            if(result.status === "error") {
                let errors = document.getElementById("errors");
                errors.innerText = result.message;
                errors.style.visibility = "visible";
            }
        }

    };

    return (
        <Layout title="Sign-in" empty>
            <h1 className={utilStyles.headingXl}>Use email and password to login</h1>

            <p id="errors" style={{visibility: "hidden"}} className={utilStyles.error}></p>

            <form method="POST" className={formStyles.form} onSubmit={onSubmitHandler}>
                <label htmlFor="email" className={utilStyles.headingMd}>Email</label><input type="email" id="email" name="email" defaultValue={props.email} required />
                <label htmlFor="password" className={utilStyles.headingMd}>Password</label><input type="password" id="password" name="password" required />
                <Link href="/forgotten"><a className={utilStyles.smallText}>Password forgotten</a></Link>
                <div className={formStyles.checkbox}><label htmlFor="remember" className={utilStyles.headingMd}>Remain connected</label><input type="checkbox" id="remember" name="remember" /></div>
                <input type="submit" value="Submit" className={utilStyles.headingMd} />
            </form>
            <p className={formStyles.links}><Link href="/">&larr; Go back home</Link><Link href="/sign-up">Create an account</Link></p>
        </Layout>
    );
}