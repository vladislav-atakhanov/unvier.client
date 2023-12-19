<script lang="ts">
    import {
        type Scheme,
        getSavedScheme,
        setScheme,
    } from "material/color-scheme"
    import { SegmentedButtons } from "material/components"
    import { onMount } from "svelte"
    let current: Scheme

    onMount(() => {
        current = getSavedScheme()
    })

    $: current && setScheme(current)

    const items = [
        ["light", "Светлая"],
        ["auto", "Системная"],
        ["dark", "Темная"],
    ]
</script>

<SegmentedButtons {items} bind:value={current} />
