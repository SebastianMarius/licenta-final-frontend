import { useEffect, useState } from "react"
import SearchBar from "../components/generic/SearchBar"
import Hero from "../components/homepage/Hero"
import Navbar from "../components/homepage/Navbar"
import CardsWrapper from "../components/homepage/CardsWrapper"
import Filters from "../components/homepage/Filters"
import StatsRow from "../components/homepage/StatsRow"


export const HomePage = () => {
    const [query, setQuery] = useState();
    const [rentings, setRentings] = useState();
    const [view, setView] = useState('grid');

    useEffect(() => {
        const getRentings = async () => {
            if (window.location.href.includes('localhost')) {

            }
            console.log(window.location.href);
            const fetchRentings = await fetch('http://localhost:9000/listings/cluj-napoca?forma=proprietar&maxPrice=450');
            const rentingsJson = await fetchRentings.json();
            setRentings(rentingsJson);
            console.log(rentingsJson);
        }
        getRentings();
    }, [])

    return (
        <>

            <Navbar setView={setView} view={view} />
            <Hero />
            <StatsRow rentings={rentings} />
            <SearchBar query={query} setQuery={setQuery} />
            <Filters />
            <CardsWrapper rentings={rentings} />
            {/* <ListingGrid items={rentings} view={view} onOpen={() => console.log('implement me!')} /> */}
        </>
    )
}