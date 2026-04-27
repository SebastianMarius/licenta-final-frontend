import { createContext, useContext, useState, useMemo } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const stored = localStorage.getItem('filters');
    const filtersFromLocalSt = stored ? JSON.parse(stored) : {};

    const [city, setCity] = useState('cluj-napoca');
    const [rentings, setRentings] = useState();
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
        setCity
    }), [filters, rentings, city]);

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);