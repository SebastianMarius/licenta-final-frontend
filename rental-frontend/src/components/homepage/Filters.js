import styles from './Filters.module.css';

const SOURCES = ['All', 'olx', 'storia', 'publi24', 'imobiliare'];
const SRC_LBL = { olx: 'OLX', storia: 'Storia', publi24: 'Publi24', imobiliare: 'Imobiliare' };
const ROOMS = ['Any', '1', '2', '3', '4+'];
const PRICES = ['Any', '300', '500', '700', '1000'];
const SORTS = [
    { key: 'newest', label: 'Recent' },
    { key: 'price_asc', label: 'Price↑' },
    { key: 'price_desc', label: 'Price↓' },
    { key: 'area', label: 'Area↓' },
];

export default function Filters({
    activeSource,
    activeRooms,
    maxPrice,
    sortMode,
    onSourceChange,
    onRoomsChange,
    onPriceChange,
    onSortChange,
}) {
    return (
        <div className={styles.filters}>

            {/* Sources */}
            {SOURCES.map(s => (
                <button
                    key={s}
                    className={`${styles.chip} ${activeSource === s ? styles.chipOn : ''}`}
                    onClick={() => onSourceChange(s)}
                >
                    {s === 'All' ? 'All sources' : SRC_LBL[s] || s}
                </button>
            ))}

            <div className={styles.divider} />

            {/* Rooms */}
            {ROOMS.map(r => (
                <button
                    key={r}
                    className={`${styles.chip} ${activeRooms === r ? styles.chipOn : ''}`}
                    onClick={() => onRoomsChange(r)}
                >
                    {r === 'Any' ? 'Any rooms' : `${r} cam.`}
                </button>
            ))}

            <div className={styles.divider} />

            {/* Max price */}
            {PRICES.map(p => (
                <button
                    key={p}
                    className={`${styles.chip} ${maxPrice === p ? styles.chipOn : ''}`}
                    onClick={() => onPriceChange(p)}
                >
                    {p === 'Any' ? 'Any price' : `≤${p}€`}
                </button>
            ))}

            {/* Sort — pushed to the right */}
            <div className={styles.sort}>
                {SORTS.map(({ key, label }) => (
                    <button
                        key={key}
                        className={`${styles.sortBtn} ${sortMode === key ? styles.sortBtnOn : ''}`}
                        onClick={() => onSortChange(key)}
                    >
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
}