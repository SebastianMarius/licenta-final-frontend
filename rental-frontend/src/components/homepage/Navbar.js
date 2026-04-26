import { useState } from "react";
import styles from "./Navbar.module.css";

export default function Navbar({ view, setView }) {

    function changeView(view) {
        setView?.(view);
    }

    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                rent<span>Me</span>
            </div>

            <nav className={styles.nav}>
                <button
                    className={`${styles.navBtn} ${view === "grid" ? styles.active : ""}`}
                    onClick={() => changeView("grid")}
                >
                    Grid
                </button>

                <button
                    className={`${styles.navBtn} ${view === "list" ? styles.active : ""}`}
                    onClick={() => changeView("list")}
                >
                    List
                </button>
            </nav>
        </header>
    );
}