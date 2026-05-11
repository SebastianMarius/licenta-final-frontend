import Navbar from "../components/homepage/Navbar"
import styles from "./MyListingsPage.module.css"

export function MyListingsPage() {
    return (
        <>
            <Navbar />
            <main className={styles.main}>
                <h1 className={styles.title}>My listings</h1>
                <p className={styles.lead}>
                    Your posted rentals will appear here once you connect this page to your API.
                </p>
            </main>
        </>
    )
}
