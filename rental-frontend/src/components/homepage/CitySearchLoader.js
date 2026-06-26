import { useEffect, useState } from 'react';
import styles from './CitySearchLoader.module.css';

const STAGES = [
    'Connecting to rental sources…',
    'Scanning OLX listings…',
    'Scanning Storia listings…',
    'Scanning Publi24 listings…',
    'Scanning Imobiliare listings…',
    'Matching and organizing results…',
    'Almost there — finalizing your feed…',
];

const SOURCES = ['OLX', 'Storia', 'Publi24', 'Imobiliare'];

const HINTS = [
    'First-time city searches can take a few minutes while we collect fresh data.',
    'rentMe pulls listings from multiple platforms so you see everything in one place.',
    'You can adjust filters once results load — they stay applied per city.',
    'Still working — larger cities usually return more listings.',
];

function formatCitySlug(slug) {
    return slug
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function formatElapsed(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, '0')} elapsed`;
}

function calcProgress(elapsedMs) {
    const seconds = elapsedMs / 1000;
    if (seconds < 20) return Math.floor((seconds / 20) * 18);
    if (seconds < 60) return 18 + Math.floor(((seconds - 20) / 40) * 22);
    if (seconds < 120) return 40 + Math.floor(((seconds - 60) / 60) * 25);
    if (seconds < 180) return 65 + Math.floor(((seconds - 120) / 60) * 18);
    return Math.min(92, 83 + Math.floor((seconds - 180) / 30));
}

export default function CitySearchLoader({ city }) {
    const [progress, setProgress] = useState(0);
    const [stageIndex, setStageIndex] = useState(0);
    const [hintIndex, setHintIndex] = useState(0);
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        setProgress(0);
        setStageIndex(0);
        setHintIndex(0);
        setElapsed(0);

        const start = Date.now();

        const tick = setInterval(() => {
            const ms = Date.now() - start;
            setElapsed(ms);
            setProgress(calcProgress(ms));
            setStageIndex(Math.min(Math.floor(ms / 14000), STAGES.length - 1));
            setHintIndex(Math.floor(ms / 18000) % HINTS.length);
        }, 500);

        return () => clearInterval(tick);
    }, [city]);

    const activeSourceCount = Math.min(SOURCES.length, Math.floor(stageIndex / 1.5) + 1);

    return (
        <section className={styles.loader} aria-live="polite" aria-busy="true">
            <div className={styles.glow} aria-hidden="true" />

            <div className={styles.card}>
                <div className={styles.brand}>
                    rent<span>Me</span>
                </div>

                <div className={styles.iconRing} aria-hidden="true">
                    <span className={styles.iconDot} />
                    <span className={styles.iconHome}>⌂</span>
                </div>

                <h2 className={styles.heading}>
                    Searching <span>{formatCitySlug(city)}</span>
                </h2>
                <p className={styles.subtitle}>
                    Gathering the latest rentals from all sources
                </p>

                <div className={styles.progressTrack} role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                    <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                </div>

                <div className={styles.progressMeta}>
                    <p className={styles.stage}>{STAGES[stageIndex]}</p>
                    <span className={styles.percent}>{progress}%</span>
                </div>

                <div className={styles.sources} aria-label="Listing sources">
                    {SOURCES.map((source, index) => (
                        <span
                            key={source}
                            className={`${styles.sourcePill} ${index < activeSourceCount ? styles.sourceActive : ''} ${index === activeSourceCount - 1 ? styles.sourceScanning : ''}`}
                        >
                            {source}
                        </span>
                    ))}
                </div>

                <p className={styles.hint}>{HINTS[hintIndex]}</p>
                <p className={styles.elapsed}>{formatElapsed(elapsed)}</p>
            </div>
        </section>
    );
}
