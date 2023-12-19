<script lang="ts">
    import {
        type Scheme,
        getSavedScheme,
        setScheme,
    } from "material/color-scheme"
    import { SegmentedButtons } from "material/components"
    import { onMount } from "svelte"

    import { i18n } from "material/i18n"
    const _ = i18n()
    let current: Scheme

    onMount(() => {
        current = getSavedScheme()
    })

    $: current && setScheme(current)

    const items = [
        ["light", _("color-scheme.light")],
        ["auto", _("color-scheme.auto")],
        ["dark", _("color-scheme.dark")],
    ]
</script>

<SegmentedButtons {items} bind:value={current} />
