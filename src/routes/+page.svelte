<script>
    import Titles from './../lib/components/titles.svelte';
    import { goto } from '$app/navigation';
  
    let searchQuery = '';
    console.log('🔄 [Client] Debug: "searchQuery" component initialized');

    let filterType = 'all';
    console.log('🔄 [Client] Debug: "filterType" component initialized');

    let sortBy = 'best-match';
    console.log('🔄 [Client] Debug: "sortBy" component initialized');

    let pageNumber = 1;
    console.log('🔄 [Client] Debug: "pageNumber" component initialized');

    let minPrice = '';
    console.log('🔄 [Client] Debug: "minPrice" component initialized');

    let maxPrice = '';
    console.log('🔄 [Client] Debug: "maxPrice" component initialized');


    function handleSubmit() {
        pageNumber = 1; // Reset page number on new search

        const queryParams = new URLSearchParams({
            search: searchQuery,
            filter: filterType,
            sort: sortBy,
            page: pageNumber.toString(),
            minPrice: minPrice,
            maxPrice: maxPrice
        }).toString();
        goto(`/results?${queryParams}`);
        console.log('🚀 [Client] Debug: Navigating to results page:', `/results?${queryParams}`);
    }
</script>

<style lang="scss">
    @import "/static/style.scss";
</style>

<main id="sveltekit-body">
    <Titles>eBay Deal Scraper</Titles>
    <div id="input-container">
        <label for="search">Search:</label>
        <input type="text" id="search" bind:value={searchQuery} on:input={() => console.log('📝 [Client] Debug: Search query updated:', searchQuery)} placeholder="Enter search query...">
                
        <label for="filter" style="margin-top: 15px !important;">Filter:</label>
        <select id="filter" bind:value={filterType} on:change={() => console.log('🔧 [Client] Debug: Filter changed to:', filterType)}>
            <option value="all">All</option>
            <option value="auction">Auction</option>
            <option value="buy-it-now">Buy It Now</option>
        </select>
        
        <label for="sort" style="margin-top: 15px !important;">Sort By:</label>
        <select id="sort" bind:value={sortBy} on:change={() => console.log('📊 [Client] Debug: Sort changed to:', sortBy)}>
            <option value="best-match">Best Match</option>
            <option value="price">Price + Shipping (lowest to highest)</option>
            {#if filterType === 'auction'}
                <option value="end-time">Auction End Time</option>
            {/if}
        </select>

        <label for="minPrice" style="margin-top: 15px !important;">Min Price:</label>
        <input type="number" id="minPrice" bind:value={minPrice} placeholder="Enter min price">

        <label for="maxPrice" style="margin-top: 15px !important;">Max Price:</label>
        <input type="number" id="maxPrice" bind:value={maxPrice} placeholder="Enter max price">

        <button style="margin-top: 35px !important;" on:click={handleSubmit}>Search</button>
    </div>
</main>