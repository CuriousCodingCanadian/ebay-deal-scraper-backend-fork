<script lang="ts">
    import Titles from "$lib/components/titles.svelte";
    import type { PageData, SearchResult } from '$lib/types.ts';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    export let data: PageData;

    let allResults: SearchResult[] = data?.results || [];
    let browserIsFirefox: boolean = false; // Declare outside, initialize to a default value
    let currentPage: number = 1; // Declare outside, initialize to a default value
    let currentPageIsOne: boolean = false;
    // let goToBaseUrl: () => void;
    let getBaseUrl: string;
    let back: () => void;
    let forward: () => void;

    onMount(() => {
        const url = new URL(window.location.href);

        allResults = data?.results || [];
        browserIsFirefox = navigator.userAgent.toLowerCase().includes("firefox");

        // Variable for current page
        currentPage = parseInt(url.searchParams.get("page") || "1", 10);
        if (currentPage === 1) currentPageIsOne = true

        back = () => {
            const url = new URL(window.location.href); // Declare url inside back
            url.searchParams.set("page", Math.max(1, currentPage - 1).toString());
            window.location.href = url.toString();
        };

        forward = () => {
            const url = new URL(window.location.href); // Declare url inside forward
            url.searchParams.set("page", (currentPage + 1).toString());
            window.location.href = url.toString();
        };

        getBaseUrl = new URL(window.location.href).origin
        // goToBaseUrl = () => goto(getBaseUrl);
    });
</script>

<style lang="scss">
    @import "/static/style.scss";
</style>

<main id="sveltekit-body">
    <div id="searchresults-title-flexbox">
        <a href={getBaseUrl} class="inline-block" aria-label="Go to home page">
            <div class="fa-solid fa-house-chimney inline-block" aria-label="Go to home page"></div>
        </a>          
        <Titles class="" id="" inlinestyle="justify-self:center; align-self:start; margin-top: -15px; margin-bottom: 10px;">Search results</Titles>
    </div>

        <!-- Commented out because I fixed this with an image proxy -->
        <!-- {#if browserIsFirefox}
            <p class="warning" style="text-align: center !important;"><span class="warning-red">Warning:</span> Firefox browser detected. If the images aren't loading properly, please disable <strong>Enhanced Tracking Protection</strong> for this site.</p>
        {/if} -->

        <!-- Commented out because I don't think this is an issue / this is happening -->
            <!-- <p class="warning" style="text-align: center !important;"><span class="warning-red">Possible Bug:</span> Your timezone <em>may</em> be incorrectly recognized, causing listing end times to be off. This issue is being investigated.</p> -->
        
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

                        <p>Seller: {result.sellerName} &lpar;<span class="tooltip">{result.feedbackScore}<sup class="tooltip-questionmark">?</sup> <span class="tooltiptext"><b>Feedback Score</b><br><br>eBay Feedback Score is another way to check the credibility of a seller, instead of the positive review percentage. <br><br>
                            Here's how it works: <br>
                                - If a buyer leaves a positive review, it adds +1 point to the Credibility Score.<br>
                                - Neutral reviews don't add or remove any points so the score stays the same.<br>
                                - Negative reviews take away -1 point.<br><br>
                            However, this is not as accurate of a measurement for smaller sellers, because a seller with a lower credibility score might still be credible, and they just don't have as many reviews/feedback yet.</span></span>&rpar; ({result.feedbackPercentage}% positive reviews)
                        </p>
                    </div>
                </div>
            {/each}
        {:else}
            <p>No results found</p>
        {/if}
    </div>

    <!-- <div class="load-more-button">
        {#if !loading}
            <button on:click={loadMore}>Load More</button>
        {:else}
            <p>Loading...</p>
        {/if}
    </div> -->

    <div class="pagination">
        <!-- {#if currentPage > 1} -->
        <button disabled="{currentPageIsOne}" on:click={back} aria-label="Previous Page"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i>&nbsp;&nbsp;Forward</button>
        <!-- {/if} -->
        <button on:click={forward} aria-label="Next Page">Back&nbsp;&nbsp;<i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>
    </div>
</main>