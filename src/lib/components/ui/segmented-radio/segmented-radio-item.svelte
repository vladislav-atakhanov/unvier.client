<script lang="ts">
    import type { Snippet } from "svelte"
    import type { HTMLInputAttributes } from "svelte/elements"
    import { useRadio } from "./segmented-radio.svelte"

    const radio = useRadio()
    let {children, ...restProps}: {children?: Snippet} & HTMLInputAttributes = $props()
</script>

<label class="flex-1">
    <input class="sr-only" type="radio" bind:group={radio.value} {...restProps} />
    <span class="ring-offset-background hover:bg-muted hover:text-muted-foreground flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-transparent h-10 px-3">{@render children?.()}</span>
</label>
<style>
    label:focus-visible {
        @apply ring-ring outline-none ring-2 ring-offset-2
    }
    input:checked + span {
        @apply bg-accent text-accent-foreground
    }
    input:disabled + span {
        @apply bg-accent text-accent-foreground pointer-events-none opacity-50
    }
</style>