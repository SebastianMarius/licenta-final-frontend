import { Navigate, useSearchParams } from "react-router-dom";
import { useAppContext } from "./context/AppContext";

/** Logged-in users only (token + user in context / localStorage). */
export function PrivateRoute({ children }) {
    const { isAuthenticated } = useAppContext();
    if (!isAuthenticated) return <Navigate to="/" replace />;
    return children;
}

/**
 * Reset links from email use ?token= without a session. Allow access if:
 * - valid-looking token in URL, or
 * - already signed in (e.g. opened from app).
 * Blocks anonymous visits with no token.
 */
export function ResetPasswordRoute({ children }) {
    const [searchParams] = useSearchParams();
    const { isAuthenticated } = useAppContext();
    const token = searchParams.get("token")?.trim();
    if (token || isAuthenticated) return children;
    return <Navigate to="/" replace />;
}
