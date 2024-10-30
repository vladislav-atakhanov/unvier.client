<script lang="ts">
    import { useHold } from "./hold.svelte"

    const hold = useHold()
    let { class: class_ = "" } = $props()
</script>

<div
    class="absolute rounded-full transition-colors {class_}"
    style:--scale={hold.progress}
    style:left="{hold.x}px"
    style:top="{hold.y}px"
    style:width="{hold.size}px"
    style:height="{hold.size}px"
></div>

<style>
    div {
        transform: translate(-50%, -50%) scale(var(--scale, 0));
        background-color: var(
            --bubble-color,
            color-mix(in srgb, currentColor 10%, transparent)
        );
    }
</style>
