import { createContext, useContext, useState, useMemo, useCallback } from "react";

const AppContext = createContext();

function readStoredAuthUser() {
    try {
        const raw = localStorage.getItem('user');
        if (!raw) return null;
        const u = JSON.parse(raw);
        if (u?.email && typeof u.email === 'string') return { email: u.email };
        return null;
    } catch {
        return null;
    }
}

export const AppProvider = ({ children }) => {
    const stored = localStorage.getItem('filters');
    const filtersFromLocalSt = stored ? JSON.parse(stored) : {};

    const [authUser, setAuthUser] = useState(readStoredAuthUser);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setAuthUser(null);
    }, []);

    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [authModalFlow, setAuthModalFlow] = useState('login');

    const openAuthModal = useCallback((flow = 'login') => {
        setAuthModalFlow(flow);
        setAuthModalOpen(true);
    }, []);

    const closeAuthModal = useCallback(() => {
        setAuthModalOpen(false);
    }, []);

    const [city, setCity] = useState('cluj-napoca');
    const [rentings, setRentings] = useState();
    const [rentingDetails, setRentingDetails] = useState();
    const [shouldShowDetailsModal, setShouldShowDetailsModal] = useState(false);
    const [savedRentings, setSavedRentings] = useState([]);
    const [filters, setFilters] = useState({
        rentSource: filtersFromLocalSt.rentSource ?? "All",
        maxPrice: filtersFromLocalSt.maxPrice ?? 'Any',
        minRoms: filtersFromLocalSt.minRoms ?? 'Any',
        forma: filtersFromLocalSt.forma ?? 'Any',
        sortingMethod: filtersFromLocalSt.sortingMethod ?? 'newest'
    });

    const value = useMemo(() => ({
        filters,
        setFilters,
        rentings,
        setRentings,
        city,
        setCity,
        rentingDetails,
        setRentingDetails,
        savedRentings,
        setSavedRentings,
        shouldShowDetailsModal,
        setShouldShowDetailsModal,
        authUser,
        setAuthUser,
        logout,
        isAuthenticated: !!authUser?.email && !!localStorage.getItem('token'),
        authModalOpen,
        authModalFlow,
        openAuthModal,
        closeAuthModal
    }), [filters, rentings, city, rentingDetails, savedRentings, shouldShowDetailsModal, authUser, logout, authModalOpen, authModalFlow, openAuthModal, closeAuthModal]);

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);