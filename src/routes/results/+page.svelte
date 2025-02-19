<!-- <script lang="ts">
    import Titles from "$lib/components/titles.svelte";
    import type { PageData } from '$lib/types.ts';
    
    export let data: PageData;
</script>

<style lang="scss">
    /* svelte-ignore css_unused_selector */
    @import "/static/style.scss";

    .result-item {
        margin: 1rem 0;
        padding: 1rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        display: flex;
        gap: 1rem;
    }

    .thumbnail {
        width: 150px;
        height: 150px;
        object-fit: contain;
    }

    .content {
        flex: 1;
    }

    .title-link {
        color: inherit;
        text-decoration: none;
        &:hover {
            text-decoration: underline;
        }
    }
</style>

<main id="sveltekit-body">
    <Titles>Search Results</Titles>
    <p style="text-align: center !important;">Note that there is currently an image loading issue for people using the Firefox web browser. Disabling tracking protection for this site may fix the issue.</p>
    <div id="results-container">
        {#if data?.results && data?.results.length > 0}
            {#each data.results as result}
                <div class="result-item">
                    <img class="thumbnail" src={result.thumbnail} alt={result.title} />
                    <div class="content">
                        <h2>
                            <a class="title-link" href={result.link} target="_blank" rel="noopener noreferrer">
                                {result.title}
                            </a>
                        </h2>
                        <p>Price: ${result.price}</p>
                        <p><em>{result.shipping === 'Free' ? 'Free' : `${result.shipping}`}</em></p>
                        <p>Type: {result.type}</p>
                        {#if result.type === 'Auction'}
                            <p>Time Remaining: {result.timeRemaining}</p>
                        {/if}
                    </div>
                </div>
            {/each}
        {:else}
            <p>No results found</p>
        {/if}
    </div>
</main> -->

<script lang="ts">
    // Set a variable to "true" or "false" based on if the browser is Firefox
    const browserIsFirefox: boolean = navigator.userAgent.toLowerCase().includes("firefox");

    import Titles from "$lib/components/titles.svelte";
    import type { PageData, SearchResult } from '$lib/types.ts';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    export let data: PageData;

    let allResults: SearchResult[] = data?.results || [];
    let loading = false;
    let pageNumber = 1; // Start at page 1

    onMount(() => {
        allResults = data?.results || [];
    });

    async function loadMore() {
    loading = true;
    pageNumber++; // Increment page number

    const url = new URL(window.location.href);
    url.searchParams.set('page', pageNumber.toString());

    try {
        const response = await fetch(url.toString());
        if (!response.ok) {
            console.error('Failed to load more results:', response.status, response.statusText);
            const errorText = await response.text();
            console.error('Response body:', errorText); // Log the response body
            return;
        }

        const text = await response.text(); // Read response as text first
        console.log('Raw response from server:', text); // Log the raw response

        try {
            const newData = JSON.parse(text); // Then try to parse it as JSON
            if (newData?.results) {
                allResults = [...allResults, ...newData.results]; // Append new results
            }
        } catch (jsonError) {
            console.error('Error parsing JSON:', jsonError);
            console.error('Raw response that failed to parse:', text);
        }} catch (error) {
            console.error('Error loading more results:', error);
        } finally {
            loading = false;
        }
    }
</script>

<style lang="scss">
    /* svelte-ignore css_unused_selector */
    @import "/static/style.scss";

    .result-item {
        margin: 1rem 0;
        padding: 1rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        display: flex;
        gap: 1rem;
    }

    .thumbnail {
        width: 150px;
        height: 150px;
        object-fit: contain;
    }

    .content {
        flex: 1;
    }

    .title-link {
        color: inherit;
        text-decoration: none;
        &:hover {
            text-decoration: underline;
        }
    }

    .load-more-button {
        margin-top: 20px;
        text-align: center;
    }
</style>

<main id="sveltekit-body">
    <Titles>Search Results</Titles>

        {#if browserIsFirefox}
            <p id="firefox-warning" style="text-align: center !important;"><span style="color: #fc7474 !important;">Warning:</span> Firefox browser detected. If the images aren't loading properly, please disable <strong>Enhanced Tracking Protection</strong> for this site.</p>
        {/if}    
        
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
                        <p>Price: ${result.price}</p>
                        <p><em>{result.shipping === 'Free' ? 'Free' : `${result.shipping}`}</em></p>
                        <p>Type: {result.type}</p>
                        {#if result.type === 'Auction'}
                            <p>Time Remaining: {result.timeRemaining}</p>
                        {/if}
                    </div>
                </div>
            {/each}
        {:else}
            <p>No results found</p>
        {/if}
    </div>

    <div class="load-more-button">
        {#if !loading}
            <button on:click={loadMore}>Load More</button>
        {:else}
            <p>Loading...</p>
        {/if}
    </div>
</main>