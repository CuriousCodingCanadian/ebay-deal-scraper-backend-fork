<script lang="ts">
    import Titles from "$lib/components/titles.svelte";
    import type { PageData, SearchResult } from '$lib/types.ts';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import Tooltip from "$lib/components/tooltip.svelte";

    export let data: PageData;

    let allResults: SearchResult[] = data?.results || [];
    let browserIsFirefox: boolean = false; // Declare outside, initialize to a default value
    let currentPage: number = 1; // Declare outside, initialize to a default value
    let currentPageIsOne: boolean = false;
    // let goToBaseUrl: () => void;
    let getBaseUrl: string;
    let back: () => void;
    let forward: () => void;

    let width: number;

    let url: URL;

    let searchQuery = "";
    let exclusions = ""
    let filterAuction = true;
    let filterBuyItNow = true;
    let sortBy = 'best-match';
    let pageNumber = 1;
    let minPrice = "";
    let maxPrice = "";
    let loading = false;
    let condition = "";

    function updateURLParam(url: string, paramName: string, paramValue: string): string {
        const urlObj = new URL(url);
        urlObj.searchParams.set(paramName, paramValue);
        return urlObj.toString();
    }

    function handleSearchClick() {
        goto(updateURLParam(url.toString(), "search", "2"));
    }

    onMount(() => {
        url = new URL(window.location.href);

        allResults = data?.results || [];
        browserIsFirefox = navigator.userAgent.toLowerCase().includes("firefox");

        // Variable for current page
        currentPage = parseInt(url.searchParams.get("page") || "1", 10);
        if (currentPage === 1) currentPageIsOne = true

        back = () => {
            const url = new URL(window.location.href); // Declare url inside back
            url.searchParams.set("page", Math.max(1, currentPage - 1).toString());
            goto(url.toString());
        };

        forward = () => {
            const url = new URL(window.location.href); // Declare url inside forward
            url.searchParams.set("page", (currentPage + 1).toString());
            goto(url.toString());
        };

        getBaseUrl = new URL(window.location.href).origin
        // goToBaseUrl = () => goto(getBaseUrl);
    });
</script>

<svelte:window bind:innerWidth={width} />

<style lang="scss">
    @import "/static/styles/style.scss";
</style>

<main id="sveltekit-body">
    <div id="searchresults-title-grid">
        <a href={getBaseUrl} class="inline-block" aria-label="Go to home page">
            <div class="fa-solid fa-house-chimney inline-block" aria-label="Go to home page"></div>
        </a>
        {#if width >= 888}
        <Titles large style="margin-top: -15px; margin-bottom: 15px;">Search Results</Titles>
        {:else}
        <Titles custom-58px style="margin-top: -15px; margin-bottom: 15px;">Search Results</Titles>
        {/if}
    
        <div class="search-row">
            <input 
                id="search" 
                on:input={() => console.log('📝 [Client] Debug: Search query updated:')} 
                placeholder="Enter search query..." />
                <button type="submit" class="searchbutton" on:click={handleSearchClick}>Search</button>
        </div>
    </div>

    <!-- Add these back to input search after layout is done -->
    <!-- bind:value={searchQuery}
    on:keydown={handleSubmitEnter}

    on:click={handleSubmit} -->
    <!-- HandleSubmit one goes on the BUTTON -->

    <!-- And after the client debug search query line: -->
    <!-- , searchQuery -->



        <!-- Commented out because I fixed this with an image proxy -->
        <!-- {#if browserIsFirefox}
            <p class="warning" style="text-align: center !important;"><span class="warning-red">Warning:</span> Firefox browser detected. If the images aren't loading properly, please disable <strong>Enhanced Tracking Protection</strong> for this site.</p>
        {/if} -->

        <!-- Commented out because I don't think this is an issue / this is happening -->
            <!-- <p class="warning" style="text-align: center !important;"><span class="warning-red">Possible Bug:</span> Your timezone <em>may</em> be incorrectly recognized, causing listing end times to be off. This issue is being investigated.</p> -->
        
        <div id="main-flexbox">
            <div id="sidebar">
                <h1>Filters</h1>
                <label class="block"><Tooltip fontsize="1rem" questionmark title="Exclude Words" text="Word exclusion lets you filter out results containing a certain word. <br><br>For instance, if you are searching for something and you don't want results that contain the word &quot;box&quot;, you can type the word &quot;box&quot; into the Exclude Words box to remove all results containing the word box. <br><br>You can enter one word or multiple words. <br><br><strong>NOTE:</strong> This feature will only work properly if you separate words using commas. For example: <code>box, backplate, not working, for parts</code>">Exclude Words</Tooltip></label>
                        <input class="block" type="text" id="exclusions" bind:value={exclusions} on:input={() => console.log('📝 [Client] Debug: Search Exclusions updated:', exclusions)} placeholder="Enter words to exclude...">
                        <br>
                        <label for="listing-type">Listing Type:</label>
                        <div id="listing-type">
                            <label>
                                <input class="listingtypecheckboxes" type="checkbox" bind:checked={filterAuction}>
                                Auction
                            </label>
                            <br>
                            <label>
                                <input class="listingtypecheckboxes" type="checkbox" bind:checked={filterBuyItNow}>
                                Buy It Now
                            </label>
                        </div>
                
                        <!-- {#if filterAuction && !filterBuyItNow}
                            <p class="warning" style="text-align: center !important;"><span class="warning-red">Warning:</span> The auction filter might not work as expected. The issue is being investigated.</p>
                        {/if} -->
                        
                        <label class="block" for="sort" style="margin-top: 15px !important;">Sort By:</label>
                        <select class="block" id="sort" bind:value={sortBy} on:change={() => console.log('📊 [Client] Debug: Sort changed to:', sortBy)}>
                            <option value="best-match">Best Match</option>
                            <option value="price">Price + Shipping (lowest to highest)</option>
                            <option value="-price">Price + Shipping (highest to lowest)</option>
                            <option value="newly-listed">List Time (new to old)</option>
                            {#if filterAuction && !filterBuyItNow}
                                <option value="end-time">Auction End Time</option>
                            {/if}
                        </select>
                
                        <label class="block" for="minPrice" style="margin-top: 15px !important;">Min Price:</label>
                        <input class="block" type="number" id="minPrice" bind:value={minPrice} placeholder="Enter min price">
                
                        <label class="block" for="maxPrice" style="margin-top: 15px !important;">Max Price:</label>
                        <input class="block" type="number" id="maxPrice" bind:value={maxPrice} placeholder="Enter max price">
            </div>
            <div id="results-container">
                {#if allResults && allResults.length > 0}
                    {#each allResults as result}
                        <div class="result-item">
                            <img class="thumbnail" src={result.thumbnail} alt={result.title} />
                            <div class="content">
                                <h2>
                                    <a class="title-link" href={result.link} target="_blank" rel="noopener noreferrer">
                                        {result.title}
                                    </a>
                                </h2>
                                {#if result.type === 'FIXED_PRICE' && result.price !== 'N/A'}
                                    <p>Price: ${result.price}</p>
                                {:else if result.type === 'AUCTION' && result.bidprice !== 'N/A'}
                                    <p>Current Bid: ${result.bidprice} (<a class="bid-link" href="https://www.ebay.com/bfl/viewbids/{result.itemnumber}?item={result.itemnumber}">{result.bidcount} Bids</a>)</p>
                                        <p>Time Remaining: {result.timeRemaining}</p>
                                {:else if result.bidprice === 'N/A' || result.price === "N/A"}
                                    <p>Price: N/A (Internal Server Error)</p>
                                {:else}
                                    <p>Price: N/A (Internal Server Error)</p>
                                {/if}
                                <p>Condition: {result.condition}</p>
                                <p><em>{result.shipping === 'Free' ? 'Free' : `${result.shipping}`}</em></p>
                                {#if result.type === 'FIXED_PRICE'}
                                    <p>Type: Buy It Now</p>
                                {:else if result.type === 'AUCTION'}
                                    <p>Type: Auction</p>
                                {:else}
                                    <p>Type: {result.type}</p>
                                {/if}

                                <p>Seller: {result.sellerName} &lpar;
                                    <Tooltip
                                        title="Feedback Score" 
                                        text="eBay Feedback Score is another way to check the credibility of a seller, instead of the positive review percentage. <br><br>
                                    Here's how it works: <br>
                                        - If a buyer leaves a positive review, it adds +1 point to the Credibility Score.<br>
                                        - Neutral reviews don't add or remove any points so the score stays the same.<br>
                                        - Negative reviews take away -1 point.<br><br>
                                    However, this is not as accurate of a measurement for smaller sellers, because a seller with a lower credibility score might still be credible, and they just don't have as many reviews/feedback yet." 
                                        fontsize="1rem"
                                        questionmark
                                    >{result.feedbackScore}
                                    </Tooltip>&rpar; ({result.feedbackPercentage}% positive reviews)
                                </p>
                            </div>
                        </div>
                    {/each}
                {:else}
                    <p>No results found</p>
                {/if}
            </div>
        </div>

    <div class="pagination">
        <!-- {#if currentPage > 1} -->
        <button disabled="{currentPageIsOne}" on:click={back} aria-label="Previous Page"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i>&nbsp;&nbsp;Forward</button>
        <!-- {/if} -->
        <button on:click={forward} aria-label="Next Page">Back&nbsp;&nbsp;<i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>
    </div>
</main>