<script lang="ts">
    let { children, redtext, ...rest } = $props();
    let bold: boolean = $state(false);
    for (const key in rest) {
        const match = key.match(/\bbold\b/);
        if (match) {bold = true}
    }
</script>

{#if bold}
    <p class="warning" style="text-align: center; font-size: 1.25em;">
        <strong>
            <span class="warning-red">{redtext}</span> 
            {@render children()}
        </strong>
    </p>
{:else}
    <p class="warning" style="text-align: center; font-size: 1.25em;">
        <span class="warning-red">{redtext}</span> 
        {@render children()}
    </p>
{/if}

<style lang="scss">
    @import '/static/styles/vars.scss';

    .warning {
        font-family: $bodyFont;
        color: $text
    }

    .warning-red {
        color: #ff1111;
    }
</style>