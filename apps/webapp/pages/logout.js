import Cookies from "js-cookie";
import Link from "next/link";
import Layout from "../components/layout";

import utilStyles from "../styles/utils.module.css";

export default function Logout() {
    Cookies.remove('token');
    return (
        <Layout title="Logout">
            <h1 className={utilStyles.heading2Xl}>You've been disconnected !</h1>
            <Link href="/">&larr; Go back to home</Link>
        </Layout>
    );
}