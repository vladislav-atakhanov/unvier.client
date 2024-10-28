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
        onclick,
        ...props
    }: {
        active?: boolean
        href?: string
        title: string
        class?: string
        children?: Snippet
        onclick?: () => unknown
    } & HTMLAnchorAttributes = $props()

    let hasSlot = $derived(typeof children === "function")

    let tag = $derived(href ? "a" : onclick ? "button" : "article")
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<svelte:element
    this={tag}
    {href}
    class="p-2 border rounded block border-border {class_} text-left"
    class:transition-all={href || active || onclick}
    class:hover:bg-border={href || onclick}
    class:active
    {onclick}
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
    .active {
        @apply border-primary bg-primary bg-opacity-10;
        --border: var(--primary);
    }
</style>
