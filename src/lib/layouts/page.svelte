
<script lang="ts">
    import { type Snippet } from "svelte"

    let { class: class_ = "", children, header }: {
        children?: Snippet
        class?: string
        header?: Snippet
        footer?: Snippet
    } = $props()
</script>

<div class="page min-h-screen {class_} w-screen overflow-x-hidden">
    {@render header?.()}
    {@render children?.()}
</div>
