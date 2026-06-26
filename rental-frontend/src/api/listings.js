const BASE_URL = 'http://localhost:9000/listings';

let activeController = null;

export function isAbortError(error) {
    return error?.name === 'AbortError';
}

export function abortPendingListingsFetch() {
    activeController?.abort();
    activeController = null;
}

function buildParams(filters) {
    const params = new URLSearchParams();

    if (filters.forma === 'Proprietar') {
        params.append('forma', 'proprietar');
    }

    if (filters.maxPrice && filters.maxPrice !== 'Any') {
        params.append('maxPrice', filters.maxPrice);
    }

    if (filters.rentSource && filters.rentSource !== 'All') {
        params.append('rentSource', filters.rentSource);
    }

    if (filters.minRoms && filters.minRoms !== 'Any') {
        params.append('minRoms', filters.minRoms);
    }

    if (filters.sortingMethod && filters.sortingMethod !== 'newest') {
        params.append('sortingMethod', filters.sortingMethod);
    }

    return params;
}

function buildListingsUrl(city, filters) {
    if (filters) {
        const query = buildParams(filters).toString();
        return `${BASE_URL}/${city}${query ? `?${query}` : ''}`;
    }

    return `${BASE_URL}/${city}?forma=proprietar&maxPrice=450`;
}

export async function fetchListings(city, filters) {
    abortPendingListingsFetch();

    const controller = new AbortController();
    activeController = controller;

    try {
        const response = await fetch(buildListingsUrl(city, filters), {
            signal: controller.signal,
        });

        if (!response.ok) {
            throw new Error(`Listings request failed (${response.status})`);
        }

        return await response.json();
    } catch (error) {
        if (isAbortError(error)) return null;
        throw error;
    } finally {
        if (activeController === controller) {
            activeController = null;
        }
    }
}
