<script lang="ts">
    import { useApp } from "../../app.svelte"
    import { type Snippet } from "svelte"

    let {
        class: class_ = "",
        children,
        header,
    }: {
        children?: Snippet
        class?: string
        header?: Snippet
        footer?: Snippet
    } = $props()

    const app = useApp()
</script>

<div
    class="page h-screen overflow-y-auto {class_} w-screen overflow-x-hidden"
    style:padding-bottom="{app.navigationHeight ?? 0}px"
>
    {#if header}
        <div class="sticky left-0 right-0 top-0">{@render header()}</div>
    {/if}
    {@render children?.()}
</div>
