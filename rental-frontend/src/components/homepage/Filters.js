import { useState } from 'react';
import styles from './Filters.module.css';
import { useAppContext } from '../context/AppContext';

const SOURCES = ['All', 'olx', 'storia', 'publi24', 'imobiliare'];
const SRC_LBL = { olx: 'OLX', storia: 'Storia', publi24: 'Publi24', imobiliare: 'Imobiliare' };
const ROOMS = ['Any', '1', '2', '3', '4+'];
const MAXPRICES = ['Any', '300', '400', '450', '500', '700', '1000'];
const SORTS = [
    { key: 'newest', label: 'Recent' },
    { key: 'price_asc', label: 'Price↑' },
    { key: 'price_desc', label: 'Price↓' },
    { key: 'area', label: 'Area↓' },
];
const FORMA = ['Any', 'Proprietar']

export default function Filters({ }) {

    const { filters, setFilters, setRentings, city } = useAppContext();

    const genericFilterUpdate = async (field, value) => {
        const newFilters = { ...filters, [field]: value };
        localStorage.setItem('filters', JSON.stringify(newFilters))
        setFilters(newFilters);

        const params = new URLSearchParams();

        if (newFilters.forma === "Proprietar") {
            params.append("forma", "proprietar");
        }

        if (newFilters.maxPrice && newFilters.maxPrice !== "Any") {
            params.append("maxPrice", newFilters.maxPrice);
        }

        if (newFilters.rentSource && newFilters.rentSource !== "All") {
            params.append('rentSource', newFilters.rentSource)
        }

        if (newFilters.minRoms && newFilters.minRoms !== "Any") {
            params.append('minRoms', newFilters.minRoms)
        }

        if (newFilters.sortingMethod && newFilters.sortingMethod !== "newest") {
            params.append('sortingMethod', newFilters.sortingMethod)
        }

        const res = await fetch(
            `http://localhost:9000/listings/${city}?${params.toString()}`
        );

        const data = await res.json();
        console.log('ce pln', data)
        setRentings(data);
    };

    return (
        <div className={styles.filters}>
            {FORMA.map(forma => (
                <button
                    key={forma}
                    className={`${styles.chip} ${filters.forma === forma ? styles.chipOn : ''}`}
                    onClick={() => genericFilterUpdate('forma', forma)}
                >
                    {forma === 'Any' ? 'Proprietar si Agentie' : `${forma}`}
                </button>
            ))}

            <div className={styles.divider} />

            {SOURCES.map(source => (
                <button
                    key={source}
                    className={`${styles.chip} ${filters.rentSource === source ? styles.chipOn : ''}`}
                    onClick={() => genericFilterUpdate('rentSource', source)}
                >
                    {source === 'All' ? 'All sources' : SRC_LBL[source] || source}
                </button>
            ))}

            <div className={styles.divider} />

            {ROOMS.map(room => (
                <button
                    key={room}
                    className={`${styles.chip} ${filters.minRoms === room ? styles.chipOn : ''}`}
                    onClick={() => genericFilterUpdate('minRoms', room)}
                >
                    {room === 'Any' ? 'Any rooms' : `${room} cam.`}
                </button>
            ))}

            <div className={styles.divider} />

            {MAXPRICES.map(price => (
                <button
                    key={price}
                    className={`${styles.chip} ${filters.maxPrice === price ? styles.chipOn : ''}`}
                    onClick={() => genericFilterUpdate('maxPrice', price)}
                >
                    {price === 'Any' ? 'Any price' : `≤${price}€`}
                </button>
            ))}


            {/* Sort — pushed to the right */}
            <div className={styles.sort}>
                {SORTS.map(({ key, label }) => (
                    <button
                        key={key}
                        className={`${styles.sortBtn} ${filters.sortingMethod === key ? styles.sortBtnOn : ''}`}
                        onClick={() => genericFilterUpdate("sortingMethod", key)}
                    >
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
}