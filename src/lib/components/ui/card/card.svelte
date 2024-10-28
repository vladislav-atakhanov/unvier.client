<script lang="ts">
    import { Separator } from "$lib/components/ui/separator"
    import type { Snippet } from "svelte"
    import type { HTMLAnchorAttributes } from "svelte/elements"

    let {
        active = false,
        href,
        title,
        class: class_ = "",
        children,
        ...props
    }: {
        active?: boolean
        href?: string
        title: string
        class?: string
        children?: Snippet
    } & HTMLAnchorAttributes = $props()

    let hasSlot = $derived(typeof children === "function")
</script>

<svelte:element
    this={href ? "a" : "article"}
    {href}
    class="p-2 border rounded block border-border {class_}"
    class:transition-all={href || active}
    class:card--button={href}
    class:card--active={active}
    {...props}
>
    <h2>{title}</h2>
    {#if hasSlot}
        <Separator class="my-2" />
    {/if}
    {@render children?.()}
</svelte:element>

<style>
    h2 {
        word-wrap: break-word;
    }
    .card--button:hover {
        @apply bg-border
    }
    .card--active {
        @apply border-primary bg-primary bg-opacity-10;
        --border: var(--primary);
    }
</style>
