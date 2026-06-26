import { useCallback, useEffect, useState } from 'react';
import styles from './DetailViewModal.module.css';
import { useAppContext } from '../components/context/AppContext';
import { formateDate, timeAgo } from '../utils';
import { AssistantRecommendationsModal } from './AssistantRecommendationsModal';

export const DetailViewModal = ({ rentingDetails }) => {
    const { setRentingDetails, savedRentings, setSavedRentings, setShouldShowDetailsModal, isAuthenticated } = useAppContext();
    const [slideIndex, setSlideIndex] = useState(0);
    const [showAssistant, setShowAssistant] = useState(false);

    const imageUrls = rentingDetails?.imageUrls ?? [];
    const hasImages = imageUrls.length > 0;
    const isCarousel = imageUrls.length > 1;
    const lastIdx = Math.max(0, imageUrls.length - 1);

    useEffect(() => {
        setSlideIndex(0);
    }, [rentingDetails?.id]);

    const goPrev = useCallback(() => {
        setSlideIndex((index) => (index <= 0 ? lastIdx : index - 1));
    }, [lastIdx]);

    const goNext = useCallback(() => {
        setSlideIndex((index) => (index >= lastIdx ? 0 : index + 1));
    }, [lastIdx]);

    const handleClose = useCallback(() => {
        setRentingDetails(null);
        setShouldShowDetailsModal(false);
    }, [setRentingDetails, setShouldShowDetailsModal]);

    useEffect(() => {
        if (!isCarousel) return;
        const onKey = (e) => {
            if (e.key === 'ArrowLeft') goPrev();
            if (e.key === 'ArrowRight') goNext();
            if (e.key === 'Escape') handleClose();
        };
        window.addEventListener('keydown', onKey);

        return () => window.removeEventListener('keydown', onKey);
    }, [isCarousel, goPrev, goNext, handleClose]);

    if (!rentingDetails) return null;

    const saveToLocalStorage = () => {
        const existing = localStorage.getItem("saved");
        const arr = existing ? JSON.parse(existing) : [];
        const alreadyExists = arr.some(item => item.id === rentingDetails.id);
        let arrCopy = arr;
        if (alreadyExists) {
            arrCopy = arr.filter((renting) => renting.id !== rentingDetails.id)
        }
        if (alreadyExists) return
        arrCopy.push(rentingDetails);
        localStorage.setItem("saved", JSON.stringify(arrCopy));
    }

    const {
        title,
        price,
        currency,
        areaSqm,
        squareMeters,
        description,
        address,
        city,
        createdAt,
        url,
        roomsNumber
    } = rentingDetails;

    console.log(savedRentings)
    const isSaved = savedRentings.includes(url);


    const ago = timeAgo(createdAt);
    const formattedDate = formateDate(createdAt);

    const pricePerSqm =
        price && (areaSqm || squareMeters)
            ? Math.round(price / (areaSqm || squareMeters))
            : null;

    if (showAssistant) {
        return (
            <AssistantRecommendationsModal
                rentingDetails={rentingDetails}
                onBack={() => setShowAssistant(false)}
            />
        );
    }

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>

                <button className={styles.closeBtn} onClick={handleClose}>
                    ✕
                </button>

                <div
                    className={`${styles.carousel} ${isCarousel ? styles.carouselMulti : ''}`}
                    aria-label={isCarousel ? 'Property photos' : undefined}
                >
                    {hasImages ? (
                        <>
                            <img
                                key={slideIndex}
                                src={imageUrls[slideIndex]}
                                alt=""
                                className={styles.image}
                            />
                            {isCarousel && (
                                <>
                                    <button
                                        type="button"
                                        className={`${styles.carouselNav} ${styles.carouselNavPrev}`}
                                        onClick={goPrev}
                                        aria-label="Previous image"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                            <path d="M15 18l-6-6 6-6" />
                                        </svg>
                                    </button>
                                    <button
                                        type="button"
                                        className={`${styles.carouselNav} ${styles.carouselNavNext}`}
                                        onClick={goNext}
                                        aria-label="Next image"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                            <path d="M9 18l6-6-6-6" />
                                        </svg>
                                    </button>
                                    <div className={styles.carouselDots} role="tablist" aria-label="Select photo">
                                        {imageUrls.map((_, image) => (
                                            <button
                                                key={image}
                                                type="button"
                                                role="tab"
                                                aria-selected={image === slideIndex}
                                                className={`${styles.carouselDot} ${image === slideIndex ? styles.carouselDotActive : ''}`}
                                                onClick={() => setSlideIndex(image)}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <div className={styles.noImg}>No image</div>
                    )}
                </div>

                <div className={styles.body}>

                    {/* LEFT */}
                    <div className={styles.left}>
                        <h2>{title}</h2>
                        <p className={styles.location}>📍 {address || city}</p>


                        <div className={styles.stats}>
                            <span>{areaSqm || squareMeters || '—'} m²</span>
                            <span>{roomsNumber || '—'} cam</span>
                        </div>

                        <p className={styles.desc}>
                            {description || 'No description'}
                        </p>

                        <div className={styles.dateInfo}>
                            {ago && <span>Published {ago}</span>}

                            {formattedDate && (
                                <>
                                    <span className={styles.dot}></span>
                                    <span>{formattedDate}</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className={styles.right}>
                        <div className={styles.price}>
                            {price || '—'} {currency}
                        </div>

                        {pricePerSqm && (
                            <div className={styles.perSqm}>
                                {pricePerSqm} €/m²
                            </div>
                        )}

                        <div className={styles.buttonsWrapper}>

                            <button
                                className={`${styles.saveBtn} ${isSaved ? styles.saved : ''}`}
                                onClick={() => {
                                    setSavedRentings((prev) => ([...prev, url]))
                                    saveToLocalStorage();
                                }
                                }
                            >
                                <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                >
                                    <path d="M8 13.5l-6-5.5a3.5 3.5 0 015-4.9l1 1 1-1a3.5 3.5 0 015 4.9L8 13.5z" />
                                </svg>
                                <span>{isSaved ? 'Saved ✓' : 'Save listing'} </span>
                            </button>

                            {isAuthenticated && (
                                <button
                                    type="button"
                                    className={styles.assistantBtn}
                                    aria-label="Ask assistant for recommendations"
                                    onClick={() => setShowAssistant(true)}
                                >
                                    <svg
                                        width="12"
                                        height="12"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        aria-hidden
                                    >
                                        <rect x="3" y="4.5" width="10" height="9" rx="2" />
                                        <circle cx="6.5" cy="9" r="1" fill="currentColor" stroke="none" />
                                        <circle cx="9.5" cy="9" r="1" fill="currentColor" stroke="none" />
                                    </svg>
                                    <span>Ask assistant for recommendations</span>
                                </button>
                            )}
                            <a href={url} target="_blank" rel="noreferrer" className={styles.btn}>
                                View source →
                            </a>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};