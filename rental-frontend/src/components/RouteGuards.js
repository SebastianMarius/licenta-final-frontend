import { Navigate, useSearchParams } from "react-router-dom";
import { useAppContext } from "./context/AppContext";

export function PrivateRoute({ children }) {
    const { isAuthenticated } = useAppContext();
    if (!isAuthenticated) return <Navigate to="/" replace />;
    return children;
}

export function ResetPasswordRoute({ children }) {
    const [searchParams] = useSearchParams();
    const { isAuthenticated } = useAppContext();
    const token = searchParams.get("token")?.trim();
    if (token || isAuthenticated) return children;
    return <Navigate to="/" replace />;
}
