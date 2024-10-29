<script lang="ts">
    import { cn } from "$lib/utils"
    import { useApp } from "../../app.svelte"
    import type { Snippet } from "svelte"
    import type { SvelteHTMLElements } from "svelte/elements"

    let {
        class: class_ = "",
        children,
        header,
        headerClass="",
        ...props
    }: {
        children?: Snippet
        class?: string
        header?: Snippet
        footer?: Snippet
        headerClass?: string
    } & SvelteHTMLElements["div"] = $props()

    const app = useApp()

    let headerHeight = $state(0)
</script>

<div
    class={cn(
        "page h-screen overflow-y-auto w-screen overflow-x-hidden bg-background grow-0 shrink-0 basis-[100vw]",
        class_
    )}
    style:padding-bottom="{app.navigationHeight ?? 0}px"
    style:scroll-padding-block="{headerHeight}px"
    style:padding-top="{headerHeight}px"
    data-vaul-drawer-wrapper
    {...props}
>
    {#if header}
        {#if headerClass.split(" ").includes("fixed")}
            <div class={cn("sticky left-0 w-screen top-0", headerClass)} bind:clientHeight={headerHeight}>{@render header()}</div>
        {:else}
            <div class={cn("sticky left-0 w-screen top-0", headerClass)}>{@render header()}</div>
        {/if}
    {/if}
    {@render children?.()}
</div>
