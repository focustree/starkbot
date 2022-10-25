import Link from "next/link"
import Layout from "../components/layout"

import utilStyles from "../styles/utils.module.css";
import { verifyToken } from "../lib/session";

export function getServerSideProps({req, res}) {
    const token = verifyToken(req.cookies.token);
    if(token !== null) {
        return {
            props: {
                token
            }
        }
    } else {
        return {
            props: {}
        }
    }
}

export default function Home({ token}) {

    return (
        <Layout title="Home" token={token} >
            <h1 className={utilStyles.mainTitle}>Welcome to Starknet</h1>
            <Link href={ token !== null ? `/dashboard` : '/sign-in'}>
                <a className={`${utilStyles.button} ${utilStyles.heading2Xl}`}>
                Get Started
                </a>
            </Link>
        </Layout>
    );
}