<script>
	import Filters from './../lib/components/filters.svelte';
    import Titles from './../lib/components/titles.svelte';
</script>

<style lang="scss">
    @import "/static/style.scss";
</style>

<main id="sveltekit-body">
    <Titles>eBay Deal Scraper</Titles>
    <p class="warning" style="text-align: center !important;"><span class="warning-red">Known Issue:</span> This site is in alpha&semi; features may be broken. Report issues to charlies.retro.computing@gmail.com</p>
    <Filters />
</main> 