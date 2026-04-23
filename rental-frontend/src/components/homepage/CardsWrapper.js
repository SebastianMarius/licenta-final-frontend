import styles from './CardsWrapper.module.css';
import Card from './Card';

export default function CardsWrapper({ rentings = [] }) {
    if (!rentings.length) {
        return (
            <div className={styles.empty}>
                <div className={styles.emptyIcon}>🏚</div>
                <p className={styles.emptyTitle}>No listings match</p>
                <p className={styles.emptyHint}>Try relaxing your filters</p>
            </div>
        );
    }

    return (
        <div className={styles.grid}>
            {rentings.map(listing => (
                <Card key={listing.prismaId} listing={listing} />
            ))}
        </div>
    );
}
