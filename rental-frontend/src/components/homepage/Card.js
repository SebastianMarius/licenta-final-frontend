import { ImageCarousel } from '../generic/ImageCarousel';
import styles from './Card.module.css';

const sources = { olx: 'OLX', storia: 'Storia', publi24: 'Publi24', imobiliare: 'Imobiliare' };

const ROOMS_MAP = {
    ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5,
};

const FLOOR_MAP = {
    GROUND: 'P', FIRST: 1, SECOND: 2, THIRD: 3, FOURTH: 4, FIFTH: 5,
    SIXTH: 6, SEVENTH: 7, EIGHTH: 8, NINTH: 9, TENTH: 10,
};

function parsePrice(price) {
    if (!price) return { amount: null, currency: 'EUR' };
    const match = String(price).match(/(\d+)\s*([A-Z]*)/);
    return {
        amount: match ? parseInt(match[1], 10) : null,
        currency: match?.[2] || 'EUR',
    };
}

function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hour = Math.floor(diff / 36e5);
    if (hour < 1) return '<1h';
    if (hour < 24) return `${hour}h`;
    return `${Math.floor(hour / 24)}d`;
}

export default function Card({ listing }) {
    const {
        title,
        price,
        location,
        imageUrls = [],
        source,
        squareMeters,
        url,
        date,
        // optional
        roomsNumber,
        floorNumber,
        tags = [],
        isPrivateOwner,
    } = listing;

    const { amount, currency } = parsePrice(price);
    const rooms = roomsNumber ? (ROOMS_MAP[roomsNumber] ?? roomsNumber) : null;
    const floor = floorNumber ? (FLOOR_MAP[floorNumber] ?? floorNumber) : null;

    const normalizedTags = tags
        .map(tag => (typeof tag === 'object' ? tag.value : tag))
        .filter(Boolean);

    const handleOpen = (e) => {
        e?.stopPropagation();
        window.open(url, '_blank');
    };

    const hasMeta = squareMeters || rooms || floor != null;

    return (
        <div className={styles.card} onClick={handleOpen}>

            {/* ── Image ── */}
            <div className={styles.imgWrapper}>
                {imageUrls.length ? imageUrls.length == 1 ? (
                    <img
                        src={imageUrls[0]}
                        alt={title}
                        className={styles.img}
                        onError={e => { e.currentTarget.style.display = 'none'; }}
                        loading="lazy"
                    />
                ) : <div className={styles.img}><ImageCarousel images={imageUrls} /> </div> : (
                    <div className={styles.imgPlaceholder}>🏠</div>
                )}

                <span className={`${styles.badge} ${styles[`badge_${source}`] || ''}`}>
                    {sources[source] || source}
                </span>

                {amount && (
                    <div className={styles.priceTag}>
                        <span className={styles.priceVal}>{amount.toLocaleString()}</span>
                        {' '}{currency}
                    </div>
                )}

                {isPrivateOwner && <div className={styles.pfBadge}>PF</div>}
            </div>

            {/* ── Body ── */}
            <div className={styles.body}>
                <p className={styles.title}>{title}</p>
                <p className={styles.location}>📍 {location}</p>

                {normalizedTags.length > 0 && (
                    <div className={styles.tags}>
                        {normalizedTags.slice(0, 3).map(tag => (
                            <span key={tag} className={styles.tag}>{tag}</span>
                        ))}
                        {normalizedTags.length > 3 && (
                            <span className={styles.tag}>+{normalizedTags.length - 3}</span>
                        )}
                    </div>
                )}

                {hasMeta && (
                    <div className={styles.meta}>
                        {squareMeters && (
                            <div className={styles.metaItem}>
                                <span className={styles.metaVal}>{squareMeters}</span>
                                <span className={styles.metaLbl}>m²</span>
                            </div>
                        )}
                        {rooms && (
                            <div className={styles.metaItem}>
                                <span className={styles.metaVal}>{rooms}</span>
                                <span className={styles.metaLbl}>camere</span>
                            </div>
                        )}
                        {floor != null && (
                            <div className={styles.metaItem}>
                                <span className={styles.metaVal}>{floor}</span>
                                <span className={styles.metaLbl}>etaj</span>
                            </div>
                        )}
                    </div>
                )}

                <div className={styles.footer}>
                    <span className={styles.time}>{timeAgo(date)}</span>
                    <button className={styles.openBtn} onClick={handleOpen}>
                        View →
                    </button>
                </div>
            </div>
        </div>
    );
}