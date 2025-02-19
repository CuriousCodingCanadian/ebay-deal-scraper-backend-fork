<script lang="ts">
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
    }
</style>

<main id="sveltekit-body">
    <Titles>Search Results</Titles>
    <div id="results-container">
        {#if data?.results && data?.results.length > 0}
            {#each data.results as result}
                <div class="result-item">
                    <h2>{result.title}</h2>
                    <p>Price: ${result.price}</p>
                    <p>Shipping: {result.shipping === 'Free' ? 'Free' : `$${result.shipping}`}</p>
                    <p>Type: {result.type}</p>
                    {#if result.type === 'auction'}
                        <p>Time Remaining: {result.timeRemaining}</p>
                    {/if}
                    <a href={result.link} target="_blank" rel="noopener noreferrer">View Listing</a>
                </div>
            {/each}
        {:else}
            <p>No results found</p>
        {/if}
    </div>
</main>