<script lang="ts">
	import Filters from './../lib/components/filters.svelte';
    import Titles from './../lib/components/titles.svelte';
    let width: number;
</script>

<svelte:window bind:innerWidth={width} />

<main id="sveltekit-body">
    {#if width >= 816}
    <Titles large>eBay Deal Scraper</Titles>
    {:else}
    <Titles custom-58px>eBay Deal Scraper</Titles>
    {/if}
    <p class="warning" style="text-align: center; font-size: 1.25em;"><strong><span class="warning-red">IMPORTANT:</span> This site is in alpha&semi; features may be broken. Report issues or request features with <a href="https://docs.google.com/forms/d/e/1FAIpQLScuZlY43CYsrOHs-bKopbHylZT2hW9HrDU7vsNBifN6OdAkjw/viewform?usp=dialog">this form.</a></strong></p>    
    <Filters />
</main> 

<style lang="scss">
    @import "/static/styles/style.scss";
</style>