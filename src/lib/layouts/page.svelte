
<script lang="ts">
    import { useApp } from "../../app.svelte"
    import { type Snippet } from "svelte"

    let { class: class_ = "", children, header }: {
        children?: Snippet
        class?: string
        header?: Snippet
        footer?: Snippet
    } = $props()

    const app = useApp()
</script>

<div class="page min-h-screen {class_} w-screen overflow-x-hidden" style:padding-bottom="{app.navigationHeight ?? 0}px">
    {@render header?.()}
    {@render children?.()}
</div>
