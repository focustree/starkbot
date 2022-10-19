import Link from "next/link";
import Layout from "../components/layout";
import styles from "../styles/forms.module.css"
import utilStyles from "../styles/utils.module.css";

export default function Logout() {
    return (
        <Layout title="Password changed">
            <h1 className={utilStyles.heading2Xl}>Your password has been updated !</h1>
            <h2 className={utilStyles.headingXl}>You can now connect with this new one.</h2>
            <p className={styles.links}><Link href="/">&larr; Go back to home</Link><Link href="/sign-in">Sign-in</Link></p>
        </Layout>
    );
}