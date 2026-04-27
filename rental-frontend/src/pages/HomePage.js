import { useEffect, useState } from "react"
import SearchBar from "../components/generic/SearchBar"
import Hero from "../components/homepage/Hero"
import Navbar from "../components/homepage/Navbar"
import CardsWrapper from "../components/homepage/CardsWrapper"
import Filters from "../components/homepage/Filters"
import StatsRow from "../components/homepage/StatsRow"
import { useAppContext } from "../components/context/AppContext"


export const HomePage = () => {
    const [view, setView] = useState('grid');

    const { rentings, setRentings, city } = useAppContext();

    useEffect(() => {
        const getRentings = async () => {
            if (window.location.href.includes('localhost')) {

            }

            if (!!localStorage.getItem("filters")) {
                const settingsFromLocalStorage = localStorage.getItem("filters");
                const parsedSettings = JSON.parse(settingsFromLocalStorage);

                Object.keys(parsedSettings).forEach((key) => {
                    if (parsedSettings[key] === 'Any' || parsedSettings[key] === 'All' || parsedSettings[key] === 'news') {
                        delete parsedSettings[key]
                    }
                })

                const settingsAsParams = new URLSearchParams(parsedSettings).toString();

                const fetchRentings = await fetch(`http://localhost:9000/listings/${city}?${settingsAsParams}`)
                const rents = fetchRentings.json();
                setRentings(rents);
            } else {
                const fetchRentings = await fetch(`http://localhost:9000/listings/${city}?forma=proprietar&maxPrice=450`);
                const rentingsJson = await fetchRentings.json();
                setRentings(rentingsJson);
            }

        }
        getRentings();
    }, [city])

    return (
        <>

            <Navbar setView={setView} view={view} />
            <Hero />
            <StatsRow rentings={rentings} />
            <SearchBar />
            <Filters />
            {rentings && <CardsWrapper rentings={rentings} />}
        </>
    )
}