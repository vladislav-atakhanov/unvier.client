<script lang="ts">
    import type { HTMLAttributes } from "svelte/elements"
    import { cn } from "$lib/utils.js"

    let {
        class: class_,
        symbols = 0,
        ...props
    }: { symbols?: number } & HTMLAttributes<HTMLDivElement> = $props()
</script>

<div
    class={cn(
        "bg-muted animate-pulse rounded-md text-transparent pointer-events-none inline select-none box-decoration-clone",
        { "bg-foreground bg-opacity-20": symbols > 0 },
        class_,
    )}
    style:word-break="break-all"
    {...props}
>
    {#if symbols > 0}
        {"a".repeat(symbols)}
    {/if}
</div>
