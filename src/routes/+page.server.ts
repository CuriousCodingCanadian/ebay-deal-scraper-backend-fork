// import { error } from '@sveltejs/kit';
// import { env } from '$env/dynamic/private';
// import type { PageServerLoad } from './$types';

// interface EbayItem {
//     title: string;
//     price: { value: string };
//     shippingOptions: Array<{ shippingCost: { value: string } }>;
//     buyingOptions: string[];
//     itemEndDate: string;
//     itemWebUrl: string;
// }

// export const load: PageServerLoad = async ({ url }) => {
//     console.log('🔍 DEBUG: Search initiated with URL params:', url.searchParams.toString());
    
//     const searchQuery = url.searchParams.get('search');
//     console.log('📝 DEBUG: Search query:', searchQuery);
    
//     if (!searchQuery) {
//         console.log('⚠️ DEBUG: No search query provided, returning empty results');
//         return { results: [] };
//     }

//     const filterType = url.searchParams.get('filter') || 'all';
//     const sortBy = url.searchParams.get('sort') || 'price';
//     console.log('🔧 DEBUG: Filter:', filterType, 'Sort:', sortBy);

//     try {
//         const endpoint = 'https://api.ebay.com/buy/browse/v1/item_summary/search';
//         const params = new URLSearchParams({
//             q: searchQuery,
//             filter: filterType === 'all' ? '' : `buyingOptions:{${filterType}}`,
//             sort: sortBy === 'price' ? 'price' : 'endTime'
//         });
        
//         console.log('🌐 DEBUG: Making API request to:', `${endpoint}?${params}`);
//         console.log('🔑 DEBUG: Using Auth Token:', env.EBAY_APP_ID ? 'Token present' : 'Token missing');

//         const response = await fetch(`${endpoint}?${params}`, {
//             headers: {
//                 'Authorization': `Bearer ${env.EBAY_APP_ID}`,
//                 'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
//             }
//         });

//         console.log('📡 DEBUG: API Response status:', response.status);
        
//         if (!response.ok) {
//             const errorText = await response.text();
//             console.error('❌ API Error Response:', errorText);
//             throw error(response.status, 'Failed to fetch from eBay API');
//         }

//         const data = await response.json();
//         console.log('📦 DEBUG: Raw API data received:', {
//             totalItems: data.total,
//             itemCount: data.itemSummaries?.length || 0
//         });
        
//         if (!data.itemSummaries) {
//             console.log('⚠️ DEBUG: No items found in response');
//             return { results: [] };
//         }

//         const results = data.itemSummaries.map((item: EbayItem) => {
//             const processed = {
//                 title: item.title,
//                 price: item.price?.value || 'N/A',
//                 shipping: item.shippingOptions?.[0]?.shippingCost?.value || 'Free',
//                 type: item.buyingOptions?.[0] || 'Unknown',
//                 timeRemaining: item.itemEndDate,
//                 link: item.itemWebUrl
//             };
//             console.log('🏷️ DEBUG: Processed item:', processed);
//             return processed;
//         });

//         console.log('✅ DEBUG: Returning results:', results.length, 'items found');
//         return { results };
//     } catch (err) {
//         console.error('💥 Error Details:', err);
//         throw error(500, 'Internal Server Error: Failed to fetch results from eBay');
//     }
// };


import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { PageServerLoad } from './$types';

interface EbayItem {
    title: string;
    price: { value: string };
    shippingOptions: Array<{ shippingCost: { value: string } }>;
    buyingOptions: string[];
    itemEndDate: string;
    itemWebUrl: string;
}

export const load: PageServerLoad = async ({ url }) => {
    // Initial request debugging
    console.log('🔍 DEBUG: Search initiated with URL params:', url.searchParams.toString());
    
    const searchQuery = url.searchParams.get('search');
    const filterType = url.searchParams.get('filter') || 'all';
    const sortBy = url.searchParams.get('sort') || 'price';
    
    console.log('🎯 DEBUG: Parsed parameters:', { 
        searchQuery,
        filterType,
        sortBy,
        rawUrl: url.toString()
    });
    
    if (!searchQuery) {
        console.log('⚠️ DEBUG: No search query provided, returning empty results');
        return { results: [] };
    }

    try {
        const endpoint = 'https://api.ebay.com/buy/browse/v1/item_summary/search';
        const params = new URLSearchParams({
            q: searchQuery,
            filter: filterType === 'all' ? '' : `buyingOptions:{${filterType}}`,
            sort: sortBy === 'price' ? 'price' : 'endTime'
        });
        
        // API request debugging
        const requestUrl = `${endpoint}?${params}`;
        console.log('🌐 DEBUG: Full API request URL:', requestUrl);
        console.log('🔑 DEBUG: Auth token:', {
            present: !!env.EBAY_APP_ID,
            length: env.EBAY_APP_ID?.length || 0,
            preview: env.EBAY_APP_ID ? `${env.EBAY_APP_ID.substring(0, 5)}...` : 'missing'
        });

        const response = await fetch(requestUrl, {
            headers: {
                'Authorization': `Bearer ${env.EBAY_APP_ID}`,
                'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
            }
        });

        // Response debugging
        console.log('📡 DEBUG: API Response:', {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries())
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ DEBUG: API Error Details:', {
                status: response.status,
                statusText: response.statusText,
                error: errorText,
                headers: Object.fromEntries(response.headers.entries())
            });
            throw error(response.status, `Failed to fetch from eBay API: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Data structure debugging
        console.log('📦 DEBUG: API Response structure:', {
            hasData: !!data,
            keys: Object.keys(data),
            total: data.total,
            itemCount: data.itemSummaries?.length || 0,
            firstItem: data.itemSummaries?.[0] ? Object.keys(data.itemSummaries[0]) : 'no items'
        });
        
        if (!data.itemSummaries) {
            console.log('⚠️ DEBUG: No items found in response data structure');
            return { results: [] };
        }

        const results = data.itemSummaries.map((item: EbayItem) => {
            // Item processing debugging
            console.log('🔍 DEBUG: Processing item:', {
                hasTitle: !!item.title,
                hasPrice: !!item.price?.value,
                hasShipping: !!item.shippingOptions?.[0]?.shippingCost?.value,
                hasBuyingOptions: !!item.buyingOptions?.length,
                hasEndDate: !!item.itemEndDate,
                hasUrl: !!item.itemWebUrl
            });

            const processed = {
                title: item.title,
                price: item.price?.value || 'N/A',
                shipping: item.shippingOptions?.[0]?.shippingCost?.value || 'Free',
                type: item.buyingOptions?.[0] || 'Unknown',
                timeRemaining: item.itemEndDate,
                link: item.itemWebUrl
            };
            console.log('🏷️ DEBUG: Processed item result:', processed);
            return processed;
        });

        console.log('✅ DEBUG: Final results:', {
            count: results.length,
            sample: results[0],
            searchParams: url.searchParams.toString()
        });
        
        return { results };
    } catch (err) {
        // Error debugging
        console.error('💥 DEBUG: Full error details:', {
            error: err,
            message: err.message,
            stack: err.stack,
            params: url.searchParams.toString()
        });
        throw error(500, 'Internal Server Error: Failed to fetch results from eBay');
    }
};