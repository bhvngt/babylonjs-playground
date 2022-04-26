<script lang="ts">
    import "@unocss/reset/tailwind.css";
    import "uno.css";
</script>

<div class="w-full h-full">
    <slot/>
</div>

<style>
    :global(html, body) {
        height: 100%;
        margin: 0;
    }

    :global(*) {
        box-sizing: border-box;
    }
</style>