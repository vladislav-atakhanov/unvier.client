<script lang="ts">
    import { Separator } from "$lib/components/ui/separator"
    import { cn } from "$lib/utils"
    import type { Snippet } from "svelte"
    import type { HTMLAnchorAttributes } from "svelte/elements"


    let {
        active = false,
        href,
        title,
        class: class_ = "",
        children,
        onclick,
        separator,
        ...props
    }: {
        active?: boolean
        href?: string
        title: Snippet | string,
        class?: string
        children?: Snippet
        separator?: Snippet
        onclick?: () => unknown
    } & Omit<HTMLAnchorAttributes, "title"> = $props()

    let hasSlot = $derived(typeof children === "function")

    let tag = $derived(href ? "a" : onclick ? "button" : "article")
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<svelte:element
    this={tag}
    {href}
    class={cn("p-2 border rounded block border-border text-left", class_)}
    class:transition-all={href || active || onclick}
    class:hover:bg-border={href || onclick}
    class:active
    {onclick}
    {...props}
>
    <h2>
        {#if typeof title === "function"}
            {@render title()}
        {:else}
            {title}
        {/if}
    </h2>
    {#if hasSlot}
        {#if separator}
            {@render separator()}
        {:else}
            <Separator class="my-2" />
        {/if}
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
