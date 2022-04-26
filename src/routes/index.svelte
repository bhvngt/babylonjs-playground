<script lang="ts">
    import {onMount} from "svelte";
    import XrScene from "$lib/xrScene";
    onMount(() => {
        new XrScene(document.getElementById("app"));
    })
</script>

<div id="app" class="flex-center w-full h-full"></div>