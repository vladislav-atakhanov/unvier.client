<script lang="ts">
    import type { Snippet } from "svelte"
    import type { HTMLInputAttributes } from "svelte/elements"
    import { useRadio } from "./segmented-radio.svelte"

    const radio = useRadio()
    let {children, class: class_, ...props}: {children?: Snippet} & HTMLInputAttributes = $props()
</script>

<label class="flex-1">
    <input class="sr-only" type="radio" name={radio.name} bind:group={radio.value} {...props} />
    <span class="{class_} ring-offset-background hover:bg-background hover:text-muted-foreground flex items-center justify-center rounded-md font-medium transition-colors bg-transparent h-10 px-3">{@render children?.()}</span>
</label>

<style>
    label:focus-visible {
        @apply ring-ring outline-none ring-2 ring-offset-2
    }
    input:checked + span {
        @apply bg-background text-foreground
    }
    input:disabled + span {
        @apply bg-accent text-accent-foreground pointer-events-none opacity-50
    }
</style>