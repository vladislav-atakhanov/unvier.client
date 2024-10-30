<script lang="ts">
    import type { Snippet } from "svelte"
    import { Drawer as DrawerPrimitive } from "vaul-svelte"

    let {
        shouldScaleBackground = true,
        open = $bindable(false),
        activeSnapPoint,
        children,
        ...props
    }: DrawerPrimitive.Props & {children?: Snippet} = $props()

    $effect(() => {
        document.body.classList.toggle("overscroll-contain", open)
        return () => {
            document.body.classList.remove("overscroll-contain")
        }
    })
</script>

<DrawerPrimitive.Root
    {shouldScaleBackground}
    backgroundColor="#888"
    bind:open
    bind:activeSnapPoint
    {...props}
>
    {@render children?.()}
</DrawerPrimitive.Root>
