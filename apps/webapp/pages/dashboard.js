import Layout, { maxBotNumber } from "../components/layout";
import { verifyToken } from "../lib/session";
import useSWR from "swr";

import styles from "../styles/dashboard.module.css";
import utilStyles from "../styles/utils.module.css"; 
import Link from "next/link";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

//  Check server-side the jwt is valid
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
            redirect: {
                destination: "/sign-in"
            }
        }
    }
}

export default function Dashboard({ token }) {

    const copyLink = (e) => {
        navigator.clipboard.writeText(e.target.innerHTML);
        document.getElementById("hovertext").innerText = "Copied!"

    };

    const resetHoverText = (e) => {
        document.getElementById("hovertext").innerText = "Copy to clipboard";
    };

    //  Get user bots
    const { data, error } = useSWR('/api/get-user-bots', fetcher);

    //  Check for errors
    if ( error || data && (data.length < 0 || data.length > maxBotNumber)) {
        return (
            <Layout title="Error" token={token}>

                <h1 className={utilStyles.mainTitle}>:(</h1>
                <h2 className={utilStyles.heading2Xl}>
                    Your bot number is not valid. Please contact an administrator.
                </h2>
            </Layout>
        );
    }
    if (!data) {
        return (
            <Layout title="Loading" token={token}>
                <h1 className={utilStyles.mainTitle}>Loading...</h1>
            </Layout>
        );
    }
    return (
        <Layout title="Dashboard" token={token}>
            <h1 className={utilStyles.headingXl}>Welcome on your dashboard</h1>
            <p>You currently have {data.length} bot key{data.length>1?'s':''}.</p>
            <p>You can use this link to add the bot on your server <div className={styles.tooltip} onClick={copyLink} onMouseLeave={resetHoverText}><code>discord:///bot-link</code><span id="hovertext" className={styles.hovertext}>Copy to clipboard</span></div></p>
            <ul className={styles.bots}>
                {data.map(({id,key}) => {
                    return <li key={id} className={utilStyles.code}>{key}</li>
                })}
            </ul>
            { data.length == 3 ? (  // Prevent adding one more bot client side
                <>
                    <p>You've reached your maximal amount of bot allowed.</p>
                </>
            ) : (
                <>
                    <div className={utilStyles.button} onClick={addKey}>Add a new bot</div>
                </>
            )}
            <Link href="/">&larr; Go back to home</Link>
            
        </Layout>
    );
}

function addKey() {
    // TODO
    // Make a query to get a new key if available
    alert("Coming soon");       // To replace
}