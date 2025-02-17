<script>
    import Titles from './../lib/components/titles.svelte';
    import { goto } from '$app/navigation';
  
    let searchQuery = '';
    let filterType = 'all'; // 'all', 'auction', 'buy-it-now'
    let sortBy = 'price'; // 'price', 'end-time'
  
    function handleSubmit() {
        const queryParams = new URLSearchParams({
            search: searchQuery,
            filter: filterType,
            sort: sortBy
        }).toString();
        goto(`/results?${queryParams}`);
    }
</script>

<style>
    @import "../../static/style.scss";
</style>

<main id="sveltekit-body">
    <Titles>eBay Deal Scraper</Titles>
    <div id="input-container">
        <label for="search">Search:</label>
        <input type="text" id="search" bind:value={searchQuery} placeholder="Enter search query...">
                
        <label for="filter" style="margin-top: 15px !important;">Filter:</label>
        <select id="filter" bind:value={filterType}>
            <option value="all">All</option>
            <option value="auction">Auction</option>
            <option value="buy-it-now">Buy It Now</option>
        </select>
        
        <label for="sort" style="margin-top: 15px !important;">Sort By:</label>
        <select id="sort" bind:value={sortBy}>
            <option value="price">Price + Shipping (lowest to highest)</option>
            <option value="end-time">Auction End Time</option>
        </select>

        <button on:click={handleSubmit}>Search</button>
    </div>
</main>