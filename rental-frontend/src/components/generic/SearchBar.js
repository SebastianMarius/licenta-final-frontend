import { useAppContext } from "../context/AppContext";
import styles from "./SearchBar.module.css";

export default function SearchBar({ query, setQuery }) {
    const { city, setCity } = useAppContext();

    const handleKeyDown = (e) => {
        const pressedKey = e.key;
        const cityProvided = e.target.value.toLowerCase();
        if (pressedKey.toLowerCase() === 'enter') {
            localStorage.setItem('city', cityProvided);
            setCity(cityProvided);
        }
    }

    return (
        <div className={styles.searchBar}>
            <span className={styles.icon}>⌕</span>

            <input
                value={query}
                onKeyDown={(e) => handleKeyDown(e)}
                placeholder="Search by title, location, or keyword…"
            />
        </div>
    );
}