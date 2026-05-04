import styles from './CardSkeleton.module.css';

export default function CardSkeleton() {
    return (
        <div className={styles.card}>
            {/* Image area */}
            <div className={styles.imgWrapper}>
                <div className={styles.shimmer} />

                {/* Source badge */}
                <span className={styles.badge} />

                {/* Price tag */}
                <div className={styles.priceTag}>
                    <span className={styles.priceVal} />
                </div>
            </div>

            {/* Body */}
            <div className={styles.body}>
                {/* Title — 2 lines */}
                <div className={`${styles.line} ${styles.titleLine1}`} />
                <div className={`${styles.line} ${styles.titleLine2}`} />

                {/* Location */}
                <div className={`${styles.line} ${styles.locationLine}`} />

                {/* Tags */}
                <div className={styles.tags}>
                    <div className={`${styles.tag}`} />
                    <div className={`${styles.tag} ${styles.tagShort}`} />
                    <div className={`${styles.tag} ${styles.tagMedium}`} />
                </div>

                {/* Meta row */}
                <div className={styles.meta}>
                    {[0, 1, 2].map(i => (
                        <div key={i} className={styles.metaItem}>
                            <div className={styles.metaVal} />
                            <div className={styles.metaLbl} />
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <div className={styles.time} />
                    <div className={styles.btn} />
                </div>
            </div>
        </div>
    );
}
