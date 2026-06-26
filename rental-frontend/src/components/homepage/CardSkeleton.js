import styles from './CardSkeleton.module.css';

export default function CardSkeleton() {
    return (
        <div className={styles.card}>
            <div className={styles.imgWrapper}>
                <div className={styles.shimmer} />

                <span className={styles.badge} />

                <div className={styles.priceTag}>
                    <span className={styles.priceVal} />
                </div>
            </div>

            <div className={styles.body}>
                <div className={`${styles.line} ${styles.titleLine1}`} />
                <div className={`${styles.line} ${styles.titleLine2}`} />

                <div className={`${styles.line} ${styles.locationLine}`} />

                <div className={styles.tags}>
                    <div className={`${styles.tag}`} />
                    <div className={`${styles.tag} ${styles.tagShort}`} />
                    <div className={`${styles.tag} ${styles.tagMedium}`} />
                </div>

                <div className={styles.meta}>
                    {[0, 1, 2].map(i => (
                        <div key={i} className={styles.metaItem}>
                            <div className={styles.metaVal} />
                            <div className={styles.metaLbl} />
                        </div>
                    ))}
                </div>

                <div className={styles.footer}>
                    <div className={styles.time} />
                    <div className={styles.btn} />
                </div>
            </div>
        </div>
    );
}
