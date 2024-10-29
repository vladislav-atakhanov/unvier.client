<script lang="ts">
    import { useApp } from "../../app.svelte"
    import type { Snippet } from "svelte"
    import type { SvelteHTMLElements } from "svelte/elements"

    let {
        class: class_ = "",
        children,
        header,
        ...props
    }: {
        children?: Snippet
        class?: string
        header?: Snippet
        footer?: Snippet
    } & SvelteHTMLElements["div"] = $props()

    const app = useApp()
</script>

<div
    class="page h-screen overflow-y-auto {class_} w-screen overflow-x-hidden bg-background"
    style:padding-bottom="{app.navigationHeight ?? 0}px"
    data-vaul-drawer-wrapper
    {...props}
>
    {#if header}
        <div class="sticky left-0 right-0 top-0">{@render header()}</div>
    {/if}
    {@render children?.()}
</div>
