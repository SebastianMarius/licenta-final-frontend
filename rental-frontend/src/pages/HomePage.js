import { useEffect, useState } from "react"
import SearchBar from "../components/generic/SearchBar"
import Hero from "../components/homepage/Hero"
import Navbar from "../components/homepage/Navbar"
import CardsWrapper from "../components/homepage/CardsWrapper"
import Filters from "../components/homepage/Filters"
import StatsRow from "../components/homepage/StatsRow"
import { useAppContext } from "../components/context/AppContext"
import { DetailViewModal } from "../modals/DetailViewModal"
import { DetailViewModalSkeleton } from "../modals/DetailViewSkeleton"
import CardSkeleton from "../components/homepage/CardSkeleton"
import wrappedStyle from "../components/homepage/CardsWrapper.module.css"
import StatsRowSkeleton from "../components/homepage/StatsRowSkeleton"
export const HomePage = () => {
    const [loadingCards, setLoadingCards] = useState(true);

    const { rentings, setRentings, city, rentingDetails, shouldShowDetailsModal } = useAppContext();

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
                const rents = await fetchRentings.json();
                setRentings(rents);
                setLoadingCards(false);
            } else {
                const fetchRentings = await fetch(`http://localhost:9000/listings/${city}?forma=proprietar&maxPrice=450`);
                const rentingsJson = await fetchRentings.json();
                setRentings(rentingsJson);
                setLoadingCards(false);
            }

        }
        getRentings();
    }, [city])

    return (
        <>

            <Navbar />
            <Hero />
            {loadingCards
                ? <StatsRowSkeleton />
                : rentings && <StatsRow rentings={rentings} />
            }
            <SearchBar />
            <Filters setLoadingCards={setLoadingCards} />

            {loadingCards ? (
                <div className={wrappedStyle.grid}>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <CardSkeleton key={i} />
                    ))}
                </div>
            ) : (
                rentings && <CardsWrapper rentings={rentings} />
            )}

            {shouldShowDetailsModal &&
                (rentingDetails ?
                    <DetailViewModal rentingDetails={rentingDetails} /> : <DetailViewModalSkeleton />)}

        </>
    )
}