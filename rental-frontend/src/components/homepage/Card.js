import { useAppContext } from '../context/AppContext';
import { ImageCarousel } from '../generic/ImageCarousel';
import styles from './Card.module.css';
import { timeAgo } from '../../utils';

const sources = {
    olx: 'OLX',
    storia: 'Storia',
    publi24: 'Publi24',
    imobiliare: 'Imobiliare',
    user: 'rentMe',
};

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


export default function Card({ listing }) {
    const {
        title,
        price,
        location,
        address,
        city,
        imageUrls = [],
        source,
        squareMeters,
        date,
        roomsNumber,
        floorNumber,
        tags = [],
        isPrivateOwner,
    } = listing;

    const { amount, currency } = parsePrice(price);
    const { setRentingDetails, setShouldShowDetailsModal } = useAppContext();

    const rooms = roomsNumber ? (ROOMS_MAP[roomsNumber] ?? roomsNumber) : null;
    const floor = floorNumber ? (FLOOR_MAP[floorNumber] ?? floorNumber) : null;

    const normalizedTags = tags
        .map(tag => (typeof tag === 'object' ? tag.value : tag))
        .filter(Boolean);

    const handleOpen = async (e) => {
        setShouldShowDetailsModal(true);
        e?.stopPropagation();
        console.log(listing.prismaId);
        const fetchListingPage = await fetch(`http://localhost:9000/renting-page/${listing.prismaId}`)
        const asJson = await fetchListingPage.json();
        setRentingDetails(asJson);
        console.log(asJson);
        // window.open(url, '_blank');
    };

    const hasMeta = squareMeters || rooms || floor != null;
    const displayLocation = location || address || city;
    const badgeLabel = sources[source] || source;

    return (
        <div className={styles.card} onClick={handleOpen}>

            <div className={styles.imgWrapper}>
                {imageUrls.length ? imageUrls.length === 1 ? (
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
                    {badgeLabel}
                </span>

                {amount && (
                    <div className={styles.priceTag}>
                        <span className={styles.priceVal}>{amount.toLocaleString()}</span>
                        {' '}{currency}
                    </div>
                )}

                {isPrivateOwner && <div className={styles.pfBadge}>PF</div>}
            </div>

            <div className={styles.body}>
                <p className={styles.title}>{title}</p>
                {displayLocation && (
                    <p className={styles.location}>📍 {displayLocation}</p>
                )}

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