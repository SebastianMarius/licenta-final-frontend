import styles from './StatRows.module.css';

function parseAmount(price) {
    if (!price) return null;
    const match = String(price).match(/(\d+)/);
    return match ? parseInt(match[1], 10) : null;
}

export default function StatsRow({ rentings = [] }) {
    const prices = rentings.map(r => parseAmount(r.price)).filter(Boolean);
    const avg = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;
    const min = prices.length ? Math.min(...prices) : 0;
    const platforms = [...new Set(rentings.map(r => r.source))].length;

    const stats = [
        { value: rentings.length, label: 'Total listings' },
        { value: platforms, label: 'Platforms' },
        { value: avg ? `${avg}€` : '—', label: 'Avg. rent' },
        { value: min ? `${min}€` : '—', label: 'From' },
    ];

    return (
        <div className={styles.row}>
            {stats.map(({ value, label }) => (
                <div key={label} className={styles.stat}>
                    <div className={styles.value}>{value}</div>
                    <div className={styles.label}>{label}</div>
                </div>
            ))}
        </div>
    );
}
