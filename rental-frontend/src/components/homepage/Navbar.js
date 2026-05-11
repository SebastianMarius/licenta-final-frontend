import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import styles from "./Navbar.module.css";

function getInitials(email) {
    const local = email.split("@")[0] || "?";
    const cleaned = local.replace(/[^a-zA-Z0-9]/g, " ").trim();
    const parts = cleaned.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return local.slice(0, 2).toUpperCase();
}

export default function Navbar() {
    const navigate = useNavigate();
    const { isAuthenticated, authUser, logout, openAuthModal } = useAppContext();
    const [menuOpen, setMenuOpen] = useState(false);
    const wrapRef = useRef(null);

    useEffect(() => {
        if (!menuOpen) return;
        const close = () => setMenuOpen(false);
        const onDoc = (e) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target)) close();
        };
        const onKey = (e) => {
            if (e.key === "Escape") close();
        };
        document.addEventListener("mousedown", onDoc);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDoc);
            document.removeEventListener("keydown", onKey);
        };
    }, [menuOpen]);

    const handleLogout = () => {
        setMenuOpen(false);
        logout();
    };

    const goMyListings = () => {
        setMenuOpen(false);
        navigate("/my-listings");
    };

    const handleResetPassword = () => {
        setMenuOpen(false);
        openAuthModal("resetPassword");
    };

    const email = authUser?.email ?? "";

    return (
        <header className={styles.header}>
            <button
                type="button"
                className={styles.logoBtn}
                onClick={() => navigate("/")}
                aria-label="Home"
            >
                <span className={styles.logo}>
                    rent<span>Me</span>
                </span>
            </button>

            {isAuthenticated ? (
                <div className={styles.userMenu} ref={wrapRef}>
                    <button
                        type="button"
                        className={styles.avatarBtn}
                        onClick={() => setMenuOpen((o) => !o)}
                        aria-expanded={menuOpen}
                        aria-haspopup="menu"
                        aria-label="Account menu"
                    >
                        <span className={styles.avatar} aria-hidden>
                            {getInitials(email)}
                        </span>
                        <svg
                            className={styles.chevron}
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            aria-hidden
                        >
                            <path d="M6 9l6 6 6-6" />
                        </svg>
                    </button>

                    {menuOpen && (
                        <div className={styles.dropdown} role="menu">
                            <div className={styles.dropdownHeader}>
                                <span className={styles.dropdownLabel}>Signed in as</span>
                                <span className={styles.dropdownEmail} title={email}>
                                    {email}
                                </span>
                            </div>
                            <div className={styles.dropdownDivider} />
                            <button
                                type="button"
                                className={styles.menuItem}
                                role="menuitem"
                                onClick={goMyListings}
                            >
                                My listings
                            </button>
                            <button
                                type="button"
                                className={styles.menuItem}
                                role="menuitem"
                                onClick={handleResetPassword}
                            >
                                Reset password
                            </button>
                            <div className={styles.dropdownDivider} />
                            <button
                                type="button"
                                className={`${styles.menuItem} ${styles.menuItemDanger}`}
                                role="menuitem"
                                onClick={handleLogout}
                            >
                                Log out
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <button
                    type="button"
                    className={styles.navBtn}
                    onClick={() => openAuthModal("login")}
                >
                    Log in
                </button>
            )}
        </header>
    );
}
