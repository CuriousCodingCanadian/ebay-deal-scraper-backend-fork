<script>
// Component Imports 
import Titles from './../lib/components/titles.svelte';
</script>

<style lang="scss">
    @import "/../static/vars.scss";

    /* Manrope Font */
    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap');

    /* SF Pro Font */
    @font-face {
    font-family: "SF Pro";
    src:
        local("SF Pro"),
        url("../appleFonts/SF-Pro.woff2") format("woff2"),
        url("../appleFonts/SF-Pro.ttf") format("truetype"),
    }

    #sveltekit-body {
		margin-left: $bodyLeftRightMargin !important;
		margin-right: $bodyLeftRightMargin !important;
        margin-top: $bodyTopMargin !important;
	}
    
    label {
        display: inline-block !important;
        font-family: $bodyFont;
        color: $fontColor;
    }

    input[type="text"] {
        padding: 10px;
        border: 1px solid $veryLightGrey;
        border-radius: 5px;
        width: 666px;
        box-sizing: border-box;
        font-family: $bodyFont;
        background-color: black;
        color: $fontColor;
    }

    button {
        font-family: $bodyFont;
        background-color: $bg;
        border: 0;
        color: $fontColor;
        border-radius: 0.5em;
        font-size: 1.35rem;
        padding: 0.375em 1em;
        font-weight: 600;
        transition: 0.2s ease;
        box-shadow: 0 0 0.6em rgba(235, 235, 235, 1);
        cursor: pointer;
    }

    button:hover {
        translate: 0 0.125em;
        box-shadow: 0 0 0.3em rgba(141, 141, 141, 1);
        color: $veryLightGrey;
    }

    #input-container {
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        text-align: center;

        label {
            margin-bottom: 5px;
        }
    }

</style>
<main id="sveltekit-body">

<Titles>eBay Deal Scraper</Titles>
<div id="input-container">
<label for="search">Search:</label>
<br>
<input type="text" id="search" placeholder="Enter search query...">
<br>
<br>
<button>Search</button>
</div>

</main>