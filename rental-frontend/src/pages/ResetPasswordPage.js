import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/homepage/Navbar";
import { useAppContext } from "../components/context/AppContext";
import styles from "./ResetPasswordPage.module.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:9000";

function getStrength(password) {
    if (!password) return { level: 0, label: "" };
    let pts = 0;
    if (password.length >= 8) pts++;
    if (password.length >= 12) pts++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) pts++;
    if (/\d/.test(password)) pts++;
    if (/[^A-Za-z0-9]/.test(password)) pts++;

    const level = pts <= 1 ? 1 : pts <= 3 ? 2 : 3;
    const labels = ["", "Weak", "Good", "Strong"];
    return { level, label: labels[level] };
}

export function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { openAuthModal } = useAppContext();

    const token = useMemo(() => searchParams.get("token")?.trim() || "", [searchParams]);

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [showPw2, setShowPw2] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [done, setDone] = useState(false);

    const strength = useMemo(() => getStrength(password), [password]);
    const matches =
        confirm.length > 0 && password === confirm ? true : confirm.length > 0 ? false : null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!token) {
            setError("This link is missing a reset token.");
            return;
        }
        if (!password || !confirm) {
            setError("Enter and confirm your new password.");
            return;
        }
        if (password !== confirm) {
            setError("Passwords do not match.");
            return;
        }
        if (password.length < 8) {
            setError("Use at least 8 characters.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                setError(data.message || data.error || "Could not reset password. The link may have expired.");
                setLoading(false);
                return;
            }
            setDone(true);
        } catch {
            setError("Network error. Check your connection and try again.");
        } finally {
            setLoading(false);
        }
    };

    const goHome = () => navigate("/");

    const requestNewLink = () => {
        navigate("/");
        openAuthModal("resetPassword");
    };

    const signIn = () => {
        navigate("/");
        openAuthModal("login");
    };

    return (
        <div className={styles.page}>
            <Navbar />

            <main className={styles.main}>
                <div className={styles.card}>
                    {!token ? (
                        <>
                            <div className={styles.badState}>
                                <div className={styles.badIcon} aria-hidden>
                                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M12 8v4M12 16h.01" />
                                    </svg>
                                </div>
                                <h1 className={styles.title}>Invalid reset link</h1>
                                <p className={styles.lead}>
                                    Open the link from your email, or request a new password reset. Links expire after some time for security.
                                </p>
                            </div>
                            <button type="button" className={styles.submit} onClick={goHome}>
                                Back to home
                            </button>
                            <div className={styles.mutedActions}>
                                <p>Need a new link?</p>
                                <button type="button" className={styles.link} onClick={requestNewLink}>
                                    Email me a reset link
                                </button>
                            </div>
                        </>
                    ) : done ? (
                        <>
                            <div className={styles.successIcon} aria-hidden>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 6L9 17l-5-5" />
                                </svg>
                            </div>
                            <h1 className={styles.title}>Password updated</h1>
                            <p className={styles.lead}>
                                Your password has been changed. You can sign in with your new credentials.
                            </p>
                            <button type="button" className={styles.submit} onClick={signIn}>
                                Continue to sign in
                            </button>
                            <button type="button" className={styles.secondary} onClick={goHome}>
                                Back to home
                            </button>
                        </>
                    ) : (
                        <>
                            <div className={styles.iconWrap} aria-hidden>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="5" y="11" width="14" height="10" rx="2" />
                                    <path d="M12 15v2M8 11V7a4 4 0 018 0v4" />
                                </svg>
                            </div>

                            <h1 className={styles.title}>Set a new password</h1>
                            <p className={styles.lead}>
                                Choose a strong password you have not used elsewhere. After saving, you will sign in with this password.
                            </p>

                            <div className={styles.tokenHint}>
                                <span className={styles.tokenDot} />
                                <span>Secure link active — finish below before it expires.</span>
                            </div>

                            {error && (
                                <div className={styles.feedbackError} role="alert">
                                    {error}
                                </div>
                            )}

                            <form className={styles.fields} onSubmit={handleSubmit} noValidate>
                                <div className={styles.field}>
                                    <label htmlFor="reset-new-password">New password</label>
                                    <div className={styles.visWrap}>
                                        <input
                                            id="reset-new-password"
                                            name="password"
                                            type={showPw ? "text" : "password"}
                                            autoComplete="new-password"
                                            placeholder="At least 8 characters"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            disabled={loading}
                                            minLength={8}
                                        />
                                        <button
                                            type="button"
                                            className={styles.visBtn}
                                            tabIndex={-1}
                                            onClick={() => setShowPw((s) => !s)}
                                        >
                                            {showPw ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                    {password.length > 0 && (
                                        <div className={styles.strength}>
                                            <div className={styles.strengthLabel}>
                                                Strength — {strength.label}
                                            </div>
                                            <div className={styles.strengthBars}>
                                                {[1, 2, 3].map((i) => (
                                                    <div
                                                        key={i}
                                                        className={`${styles.strengthBar} ${
                                                            strength.level >= i
                                                                ? strength.level === 1
                                                                    ? styles.strengthWeak
                                                                    : strength.level === 2
                                                                      ? styles.strengthMid
                                                                      : styles.strengthStrong
                                                                : ""
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className={styles.field}>
                                    <label htmlFor="reset-confirm-password">Confirm password</label>
                                    <div className={styles.visWrap}>
                                        <input
                                            id="reset-confirm-password"
                                            name="confirm"
                                            type={showPw2 ? "text" : "password"}
                                            autoComplete="new-password"
                                            placeholder="Repeat password"
                                            value={confirm}
                                            onChange={(e) => setConfirm(e.target.value)}
                                            disabled={loading}
                                        />
                                        <button
                                            type="button"
                                            className={styles.visBtn}
                                            tabIndex={-1}
                                            onClick={() => setShowPw2((s) => !s)}
                                        >
                                            {showPw2 ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                    {matches === true && (
                                        <p className={styles.matchOk}>Passwords match</p>
                                    )}
                                    {matches === false && (
                                        <p className={styles.matchBad}>Passwords do not match</p>
                                    )}
                                </div>

                                <button type="submit" className={styles.submit} disabled={loading}>
                                    {loading ? "Saving…" : "Save new password"}
                                </button>
                            </form>

                            <div className={styles.mutedActions}>
                                <button type="button" className={styles.link} onClick={goHome}>
                                    Cancel and return home
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
