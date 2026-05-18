import { useEffect, useState } from 'react';
import styles from './DetailViewModal.module.css';
import { useAppContext } from '../components/context/AppContext';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:9000';
const ROOMS_MAP = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };
const PRICE_DELTA = 100;

function priceOf(listing) {
    const m = String(listing?.price ?? '').match(/\d+/);
    return m ? parseInt(m[0], 10) : null;
}

function slim(listing) {
    if (!listing || typeof listing !== 'object') return listing;
    const img = Array.isArray(listing.imageUrls) ? listing.imageUrls[0] : undefined;
    const desc = typeof listing.description === 'string'
        ? listing.description.slice(0, 280)
        : listing.description;
    const { prismaId, externalId, id, title, price, currency, location, address, city,
        squareMeters, areaSqm, roomsNumber, source, url } = listing;
    return {
        prismaId, externalId, id, title, description: desc, price, currency,
        location, address, city, squareMeters, areaSqm, roomsNumber, source, url,
        ...(img ? { imageUrls: [img] } : {}),
    };
}

export const AssistantRecommendationsModal = ({ rentingDetails, onBack }) => {
    const { rentings, setRentingDetails, setShouldShowDetailsModal } = useAppContext();
    const [status, setStatus] = useState('loading');
    const [recommendations, setRecommendations] = useState([]);
    const [error, setError] = useState(null);

    const close = () => {
        setRentingDetails(null);
        setShouldShowDetailsModal(false);
    };

    const load = async () => {
        if (!rentingDetails) return;
        setStatus('loading');
        setError(null);
        try {
            const src = priceOf(rentingDetails);
            const candidates = (rentings ?? [])
                .filter((l) => src == null || Math.abs((priceOf(l) ?? Infinity) - src) <= PRICE_DELTA)
                .slice(0, 60)
                .map(slim);

            const res = await fetch(`${API_BASE}/assistant/recommend`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    providedListing: slim(rentingDetails),
                    listings: candidates,
                }),
            });
            if (!res.ok) throw new Error(`Request failed (${res.status})`);
            const data = await res.json();
            const list = Array.isArray(data?.recommendations) ? data.recommendations : [];
            setRecommendations(list);
            setStatus(list.length === 0 ? 'empty' : 'ready');
        } catch (e) {
            setError(e?.message || 'Something went wrong.');
            setStatus('error');
        }
    };

    useEffect(() => { load(); }, [rentingDetails, rentings]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const onKey = (e) => e.key === 'Escape' && close();
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const { title, address, city } = rentingDetails ?? {};

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button type="button" className={styles.backBtn} onClick={onBack} aria-label="Back to listing">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                    <span>Back</span>
                </button>

                <button className={styles.closeBtn} onClick={close} aria-label="Close">✕</button>

                <div className={styles.assistantHeader}>
                    <div className={styles.assistantIcon}>
                        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                            <rect x="3" y="4.5" width="10" height="9" rx="2" />
                            <circle cx="6.5" cy="9" r="1" fill="currentColor" stroke="none" />
                            <circle cx="9.5" cy="9" r="1" fill="currentColor" stroke="none" />
                        </svg>
                    </div>
                    <div className={styles.assistantTitleGroup}>
                        <h2 className={styles.assistantTitle}>Assistant recommendations</h2>
                        {(title || address || city) && (
                            <p className={styles.assistantSubtitle}>Based on: {title || address || city}</p>
                        )}
                    </div>
                </div>

                <div className={styles.assistantBody}>
                    {status === 'loading' && (
                        <div className={styles.recList} aria-busy="true">
                            {[0, 1, 2].map((i) => (
                                <div key={i} className={`${styles.recCard} ${styles.recSkeleton}`}>
                                    <div className={styles.recThumb} />
                                    <div className={styles.recBody}>
                                        <div className={styles.skelLine} style={{ width: '70%' }} />
                                        <div className={styles.skelLine} style={{ width: '45%' }} />
                                        <div className={styles.skelLine} style={{ width: '85%' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {status === 'error' && (
                        <div className={styles.recState}>
                            <div className={styles.recStateTitle}>Couldn't fetch recommendations</div>
                            <div className={styles.recStateBody}>{error}</div>
                            <button type="button" className={styles.recRetry} onClick={load}>Try again</button>
                        </div>
                    )}

                    {status === 'empty' && (
                        <div className={styles.recState}>
                            <div className={styles.recStateTitle}>No similar listings found</div>
                            <div className={styles.recStateBody}>Try broadening your filters and check again.</div>
                        </div>
                    )}

                    {status === 'ready' && (
                        <div className={styles.recList}>
                            {recommendations.map((rec, i) => {
                                const l = rec?.listing ?? {};
                                const thumb = Array.isArray(l.imageUrls) ? l.imageUrls[0] : null;
                                const rooms = l.roomsNumber ? (ROOMS_MAP[l.roomsNumber] ?? l.roomsNumber) : null;
                                const sqm = l.squareMeters || l.areaSqm;
                                const score = Math.max(0, Math.min(100, Math.round(rec?.similarityScore ?? 0)));
                                const reasons = Array.isArray(rec?.reasons) ? rec.reasons : [];

                                return (
                                    <div key={l.prismaId || l.url || i} className={styles.recCard}>
                                        <div className={styles.recThumb}>
                                            {thumb
                                                ? <img src={thumb} alt="" loading="lazy" />
                                                : <div className={styles.recThumbFallback}>🏠</div>}
                                            <div className={styles.recScore} title={`Similarity ${score}%`}>{score}</div>
                                        </div>

                                        <div className={styles.recBody}>
                                            <div className={styles.recTitleRow}>
                                                <p className={styles.recTitle}>{l.title || 'Untitled listing'}</p>
                                                {l.price != null && (
                                                    <span className={styles.recPrice}>{l.price} {l.currency || ''}</span>
                                                )}
                                            </div>

                                            {(l.location || l.address || l.city) && (
                                                <p className={styles.recLocation}>📍 {l.location || l.address || l.city}</p>
                                            )}

                                            <div className={styles.recMeta}>
                                                {sqm && <span>{sqm} m²</span>}
                                                {rooms && <span>{rooms} cam</span>}
                                                {l.source && <span>{l.source}</span>}
                                            </div>

                                            {reasons.length > 0 && (
                                                <ul className={styles.recReasons}>
                                                    {reasons.slice(0, 3).map((r, idx) => <li key={idx}>{r}</li>)}
                                                </ul>
                                            )}

                                            <div className={styles.recActions}>
                                                {l.url
                                                    ? <a href={l.url} target="_blank" rel="noopener noreferrer" className={styles.recOpen}>View listing →</a>
                                                    : <span className={`${styles.recOpen} ${styles.recOpenDisabled}`}>No link</span>}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
