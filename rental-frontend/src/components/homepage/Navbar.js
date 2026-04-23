import { useState } from "react";
import styles from "./Navbar.module.css";

export default function Navbar({ view, setView }) {
    const [active, setActive] = useState("grid");

    function changeView(v) {
        setActive(v);
        setView?.(v);
    }

    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                rent<span>Me</span>
            </div>

            <nav className={styles.nav}>
                <button
                    className={`${styles.navBtn} ${active === "grid" ? styles.active : ""}`}
                    onClick={() => changeView("grid")}
                >
                    Grid
                </button>

                <button
                    className={`${styles.navBtn} ${active === "list" ? styles.active : ""}`}
                    onClick={() => changeView("list")}
                >
                    List
                </button>
            </nav>
        </header>
    );
}