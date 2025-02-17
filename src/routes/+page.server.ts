// import { env } from '$env/dynamic/private';
// import { error } from '@sveltejs/kit';
// import type { PageServerLoad } from './$types';
// import { env } from '$env/dynamic/private';
// import type { PageServerLoad } from './$types';
// import type { SearchResult } from '$lib/types';
// import { error } from '@sveltejs/kit';

// export const load: PageServerLoad = async ({ url }) => {
//     const searchQuery = url.searchParams.get('search');
//     if (!searchQuery) {
//         return { results: [] };
//     }

//     const filterType = url.searchParams.get('filter') || 'all';
//     const sortBy = url.searchParams.get('sort') || 'price';

//     const endpoint = 'https://api.ebay.com/buy/browse/v1/item_summary/search';
//     const params = new URLSearchParams({
//         q: searchQuery,
//         filter: filterType === 'all' ? '' : `buyingOptions:{${filterType}}`,
//         sort: sortBy === 'price' ? 'price' : 'endTime'
//     });

//     try {
//         const response = await fetch(`${endpoint}?${params}`, {
//             headers: {
//                 'Authorization': `Bearer ${env.EBAY_APP_ID}`,
//                 'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
//                 'Content-Type': 'application/json'
//             }
//         });

//         if (!response.ok) {
//             throw error(response.status, 'Failed to fetch from eBay API');
//         }

//         const data = await response.json();
        
//         if (!data.itemSummaries) {
//             return { results: [] };
//         }

//         const results = data.itemSummaries.map((item) => ({
//             title: item.title,
//             price: item.price?.value || 'N/A',
//             shipping: item.shippingOptions?.[0]?.shippingCost?.value || 'Free',
//             type: item.buyingOptions?.[0] || 'Unknown',
//             timeRemaining: item.itemEndDate,
//             link: item.itemWebUrl
//         }));

//         return { results };
//     } catch (err) {
//         console.error('Error fetching from eBay API:', err);
//         throw error(500, 'Failed to fetch results from eBay');
//     }
// };

import { error, json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

interface EbayItem {
    title: string;
    price: { value: string };
    shippingOptions: Array<{ shippingCost: { value: string } }>;
    buyingOptions: string[];
    itemEndDate: string;
    itemWebUrl: string;
}

export const GET: RequestHandler = async ({ url }) => {
    const searchQuery = url.searchParams.get('search');
    if (!searchQuery) {
        return json({ results: [] });
    }

    const filterType = url.searchParams.get('filter') || 'all';
    const sortBy = url.searchParams.get('sort') || 'price';

    try {
        const endpoint = 'https://api.ebay.com/buy/browse/v1/item_summary/search';
        const params = new URLSearchParams({
            q: searchQuery,
            filter: filterType === 'all' ? '' : `buyingOptions:{${filterType}}`,
            sort: sortBy === 'price' ? 'price' : 'endTime'
        });

        const response = await fetch(`${endpoint}?${params}`, {
            headers: {
                'Authorization': `Bearer ${env.EBAY_APP_ID}`,
                'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
            }
        });

        if (!response.ok) {
            throw error(response.status, 'Failed to fetch from eBay API');
        }

        const data = await response.json();
        const results = (data.itemSummaries || []).map((item: EbayItem) => ({
            title: item.title,
            price: item.price?.value || 'N/A',
            shipping: item.shippingOptions?.[0]?.shippingCost?.value || 'Free',
            type: item.buyingOptions?.[0] || 'Unknown',
            timeRemaining: item.itemEndDate,
            link: item.itemWebUrl
        }));

        return json({ results });
    } catch (err) {
        console.error('Error fetching from eBay API:', err);
        throw error(500, 'Failed to fetch results from eBay');
    }
};