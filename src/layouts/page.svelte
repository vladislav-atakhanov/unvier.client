<script module>
    const PAGE = Symbol()
    export const usePage = () => getContext<{element: HTMLElement}>(PAGE)
</script>

<script lang="ts">
    import { getContext, setContext, type Snippet } from "svelte"

    let { class: class_ = "", children, header }: {
        children?: Snippet
        class?: string
        header?: Snippet
        footer?: Snippet
    } = $props()

    let element = $state<HTMLElement>()
    setContext(PAGE, {
        get element() {
            return element
        }
    })
</script>

<div class="min-h-screen {class_}" bind:this={element}>
    {@render header?.()}
    {@render children?.()}
</div>
