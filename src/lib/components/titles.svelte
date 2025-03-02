<script lang="ts">
    let props = $props();
</script>

<style lang="scss">
    @import '/static/vars.scss';
    .titles {
        font-family: $headingFont;
        text-align: center; 
        color: $text;
    }
</style>

<h1 class="titles {props.class}" id="{props.id}" style="font-size: 70px; {props.inlinestyle}">
    <slot />
</h1>