<script>
	import Filters from './../lib/components/filters.svelte';
    import Titles from './../lib/components/titles.svelte';
</script>

<style lang="scss">
    @import "/static/style.scss";
</style>

<main id="sveltekit-body">
    <Titles class="" id="" inlinestyle="">eBay Deal Scraper</Titles>
    <p class="warning" style="text-align: center; font-size: 1.25em;"><strong><span class="warning-red">IMPORTANT:</span> This site is in alpha&semi; features may be broken. Report issues or request features with <a href="https://docs.google.com/forms/d/e/1FAIpQLScuZlY43CYsrOHs-bKopbHylZT2hW9HrDU7vsNBifN6OdAkjw/viewform?usp=dialog">this form.</a></strong></p>
    <Filters />
</main> 