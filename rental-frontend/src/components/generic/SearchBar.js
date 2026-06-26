import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { isAllowedCity, normalizeCityInput } from "../../constants/allowedCities";
import styles from "./SearchBar.module.css";

export default function SearchBar() {
    const { city, setCity } = useAppContext();
    const [inputValue, setInputValue] = useState(city);
    const [error, setError] = useState(null);

    useEffect(() => {
        setInputValue(city);
    }, [city]);

    const handleChange = (e) => {
        setInputValue(e.target.value);
        if (error) setError(null);
    };

    const handleKeyDown = (e) => {
        if (e.key !== 'Enter') return;

        const normalized = normalizeCityInput(e.target.value);

        if (!normalized) {
            setError('Please enter a city name.');
            return;
        }

        if (!isAllowedCity(normalized)) {
            setError('You either wrote a wrong city or we do not have data for this city...');
            return;
        }

        setError(null);
        setInputValue(normalized);
        localStorage.setItem('city', normalized);
        setCity(normalized);
    };

    return (
        <div className={styles.searchWrapper}>
            <div className={`${styles.searchBar} ${error ? styles.searchBarError : ''}`}>
                <span className={styles.icon} aria-hidden="true">⌕</span>

                <input
                    value={inputValue}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Search by city…"
                    aria-label="Search by city"
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={error ? 'city-search-error' : undefined}
                />
            </div>

            {error && (
                <p id="city-search-error" className={styles.errorMessage} role="alert">
                    <span className={styles.errorIcon} aria-hidden="true">!</span>
                    {error}
                </p>
            )}
        </div>
    );
}
