<script>
    import Titles from './../lib/components/titles.svelte';
    import { goto } from '$app/navigation';
  
    let searchQuery = '';
    console.log('🔄 DEBUG: "searchQuery" component initialized');
    let filterType = 'all'; // 'all', 'auction', 'buy-it-now'
    console.log('🔄 DEBUG: "filterType" component initialized');
    let sortBy = 'price'; // 'price', 'end-time'
    console.log('🔄 DEBUG: "sortBy" component initialized');
  
    function handleSubmit() {
        console.log('🔍 DEBUG: Search initiated with:', { searchQuery, filterType, sortBy });
        const queryParams = new URLSearchParams({
            search: searchQuery,
            filter: filterType,
            sort: sortBy
        }).toString();
        goto(`/results?${queryParams}`);
        console.log('🚀 DEBUG: Navigating to results page:', `/results?${queryParams}`);
    }
</script>

<style lang="scss">
    @import "/static/style.scss";
</style>

<main id="sveltekit-body">
    <Titles>eBay Deal Scraper</Titles>
    <div id="input-container">
        <label for="search">Search:</label>
        <input type="text" id="search" bind:value={searchQuery} on:input={() => console.log('📝 DEBUG: Search query updated:', searchQuery)} placeholder="Enter search query...">
                
        <label for="filter" style="margin-top: 15px !important;">Filter:</label>
        <select id="filter" bind:value={filterType} on:change={() => console.log('🔧 DEBUG: Filter changed to:', filterType)}>
            <option value="all">All</option>
            <option value="auction">Auction</option>
            <option value="buy-it-now">Buy It Now</option>
        </select>
        
        <label for="sort" style="margin-top: 15px !important;">Sort By:</label>
        <select id="sort" bind:value={sortBy} on:change={() => console.log('📊 DEBUG: Sort changed to:', sortBy)}>
            <option value="price">Price + Shipping (lowest to highest)</option>
            <option value="end-time">Auction End Time</option>
        </select>

        <button style="margin-top: 35px !important;" on:click={handleSubmit}>Search</button>
    </div>
</main>