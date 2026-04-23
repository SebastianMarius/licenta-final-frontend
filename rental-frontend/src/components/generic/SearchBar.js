import styles from "./SearchBar.module.css";

export default function SearchBar({ query, setQuery }) {
    return (
        <div className={styles.searchBar}>
            <span className={styles.icon}>⌕</span>

            <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, location, or keyword…"
            />
        </div>
    );
}