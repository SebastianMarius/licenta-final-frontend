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
import CitySearchLoader from "../components/homepage/CitySearchLoader"
import StatsRowSkeleton from "../components/homepage/StatsRowSkeleton"
import { abortPendingListingsFetch, fetchListings, isAbortError } from "../api/listings"

export const HomePage = () => {
    const [loadingCards, setLoadingCards] = useState(true);

    const { rentings, setRentings, city, filters, rentingDetails, shouldShowDetailsModal } = useAppContext();

    useEffect(() => {
        const loadRentings = async () => {
            setLoadingCards(true);

            try {
                const hasStoredFilters = !!localStorage.getItem('filters');
                const data = await fetchListings(city, hasStoredFilters ? filters : null);

                if (data === null) return;

                setRentings(data);
                setLoadingCards(false);
            } catch (error) {
                if (!isAbortError(error)) {
                    console.error('Failed to load listings:', error);
                }
                setLoadingCards(false);
            }
        };

        loadRentings();

        return () => abortPendingListingsFetch();
    }, [city, setRentings])

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
                <CitySearchLoader city={city} />
            ) : (
                rentings && <CardsWrapper rentings={rentings} />
            )}

            {shouldShowDetailsModal &&
                (rentingDetails ?
                    <DetailViewModal rentingDetails={rentingDetails} /> : <DetailViewModalSkeleton />)}

        </>
    )
}