<script lang="ts">
    import type { Readable } from "svelte/store"

    export let loading: Readable<boolean>
    export let title: string = ""
    import { i18n } from "material/i18n"
    const _ = i18n()
</script>

{#if $loading}
    {_("updating")}
{:else}
    <slot>{title}</slot>
{/if}
