import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import styles from "../styles/layout.module.css"
import utilStyles from "../styles/utils.module.css"

export const maxBotNumber = 3;     // The maximal amount of bots allowed per user

export function getAvatar(id) {
    //  TODO
    //  A function to return a random avatar. May be the 2 first char of the id or email ?
    return id;
}

// The default layout for the applicaiton
export default function Layout({ children, empty, title, token}) {

    return (
        <div className={styles.container}>
            <Head>
                <title>{title}</title>
                <link rel="icon" href="/favicon.ico" />
                <meta
                    name="description"
                    content="Manage your bots on Starknet website"
                />
            </Head>
            <header className={styles.header}>
                <div className={styles.logo}>
                <Link href={"/"} >
                    <a>
                    <Image className={utilStyles.borderCircle}
                        style={{alignSelf: "flex-start"}}
                        src={"/images/logo.png"}
                        height={70}
                        width={70}
                        alt="Starknet"
                    
                    />
                    </a>
                </Link>
                </div>

                <div className={styles.profile}>
                {empty ? (<></>) :      // When empty, we don't need to display header's information 
                    (token && token !== null ? (             // If the token isn't null, the user is logged
                    <>
                    <Link href={`/profile`}>
                        <a className={utilStyles.centeredBlock}>
                        <Image className={utilStyles.borderCircle}
                            src={`/images/${getAvatar(token.id)}.jpg`}
                            height={60}
                            width={60}
                            alt="Avatar"
                        />
                        </a>
                    </Link>
                    <Link href="/logout">
                        <a className={`${utilStyles.button} ${utilStyles.headingMd}`}>Logout</a>
                    </Link>

                    </>
                ) : (
                    <Link href="/sign-in">
                        <a className={utilStyles.headingMd}>Sign-in</a>
                    </Link>
                ))}
                </div>
            </header>
            <main className={styles.main}>{children}</main>
            <footer className={styles.footer}>
                <Link href={"/"}><a>About Us</a></Link>
                <Link href={"/"}><a>Terms of service</a></Link>
                <Link href={"/"}><a>Contact Us</a></Link>
            </footer>
        </div>
    );
}