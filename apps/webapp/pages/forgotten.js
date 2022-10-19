import Link from "next/link";
import Layout from "../components/layout";
import { useRouter } from "next/router";

import utilStyles from "../styles/utils.module.css";

// When the user has forgotten his password
export default function Forgotten() {
    const router = useRouter();
    
    if(router.query["sent"]) {
        return (
            <Layout title="Mail sent">
                <h1 className={utilStyles.heading2Xl}>Email sent !</h1>
                <h2 className={utilStyles.headingXl}>Please check your emails</h2>
                <Link href="/">&larr; Go back home</Link>
            </Layout>
        )
    }

    return (
        <Layout title="Password forgotten" empty>
            <h1 className={utilStyles.heading2Xl}>You've forgotten your password ?</h1>
            <h2 className={utilStyles.headingXl}>No worries, we'll send you an email to reset it.</h2>

            { router.query["err"] === "no-mail" ? (
                <>
                <p className={utilStyles.error}>Please provide an email</p>
                </>
            ) : (<></>)}
            <form method="POST" action="/api/reset-password">
                <input type="email" name="email" required></input>
                <input type="submit" value="Send link" className={`${utilStyles.button} ${utilStyles.headingMd}`}></input>
            </form>
            <Link href="/">&larr; Go back home</Link>
        </Layout>
    )
}