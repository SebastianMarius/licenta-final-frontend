import styles from './StatsRowSkeleton.module.css';

export default function StatsRowSkeleton() {
    return (
        <div className={styles.row}>
            {[72, 48, 64, 52].map((w, i) => (
                <div key={i} className={styles.stat}>
                    <div className={styles.value} style={{ width: w }} />
                    <div className={styles.label} />
                </div>
            ))}
        </div>
    );
}
