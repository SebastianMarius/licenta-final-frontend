import { useState, useEffect } from "react";
import styles from "./ImageCarousel.module.css";

export const ImageCarousel = ({ images = [] }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handlePreviousClick = (e) => {
        e?.stopPropagation();
        setCurrentImageIndex((prev) =>
            prev === 0 ? images.length - 1 : prev - 1
        );
    };

    const handleNextClick = (e) => {
        e?.stopPropagation();
        setCurrentImageIndex((prev) =>
            images.length ? (prev + 1) % images.length : 0
        );
    };


    if (!images.length) return null;

    return (
        <section className={styles.section}>

            <div className={styles.imageContainer}>
                <button
                    className={`${styles.navButton} ${styles.left}`}
                    onClick={(e) => handlePreviousClick(e)}
                >
                    ‹
                </button>

                {images.map((image, index) => (
                    <img
                        key={image}
                        src={image}
                        className={`${styles.image} ${currentImageIndex === index
                            ? styles.visible
                            : styles.hidden
                            }`}
                    />
                ))}

                <button
                    className={`${styles.navButton} ${styles.right}`}
                    onClick={(e) => handleNextClick(e)}
                >
                    ›
                </button>
            </div>
        </section>
    );
};