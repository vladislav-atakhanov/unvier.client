<script module lang="ts">
    const KEY = Symbol("hold")
    class Hold {
        progress = $state(0)
        size = $state(0)
        x = $state(0)
        y = $state(0)
    }
    export const useHold = () => getContext<Readonly<Hold>>(KEY)
</script>

<script lang="ts">
    import { cn } from "$lib/utils"

    import { getContext, onDestroy, setContext, type Snippet } from "svelte"
    let {
        tag = "div",
        onhold,
        duration = 400,
        onUp = false,
        class: class_,
        children
    }: {
        tag?: string
        onhold?: () => unknown
        duration?: number
        onUp?: boolean
        class?: string
        children?: Snippet
    } = $props()

    let startTime = -1
    const hold = new Hold()
    setContext(KEY, hold)

    const call = () => {
        onhold?.()
        clear()
    }

    let startPosition = { x: -1, y: -1 }
    const onPointerMove = ({ clientX, clientY }: PointerEvent) => {
        if (startTime === -1) return
        const { x, y } = startPosition
        if (Math.hypot(clientX - x, clientY - y) < 20) return
        clear()
    }

    let node: HTMLElement

    const frame = () => {
        if (startTime === -1) return
        hold.progress = (Date.now() - startTime) / duration
        if (!onUp && hold.progress >= 1) call()
        requestAnimationFrame(frame)
    }

    const onPointerDown = ({ clientY, clientX }: PointerEvent) => {
        const { left, top, width, height } = node.getBoundingClientRect()
        hold.x = clientX - left
        hold.y = clientY - top
        startPosition.x = clientX
        startPosition.y = clientY

        const radiusX = Math.max(hold.x, width - hold.x)
        const radiusY = Math.max(hold.y, height - hold.y)
        const radius = Math.hypot(radiusX, radiusY) + 5

        hold.size = radius * 2
        startTime = Date.now()

        requestAnimationFrame(frame)
    }

    onDestroy(() => clear())

    const onPointerUp = () => {
        if (startTime === -1) return
        if (Date.now() - startTime >= duration) call()
        clear()
    }

    const clear = () => {
        startTime = -1
        hold.progress = 0
        hold.x = 0
        hold.y = 0
        hold.size = 0
    }
</script>

<svelte:window
    onpointermove={onPointerMove}
    onpointerup={onPointerUp}
    onpointercancel={clear}
/>

<svelte:element
    this={tag}
    bind:this={node}
    class={cn("relative overflow-hidden", class_)}
    onpointerdown={onPointerDown}
>
    {@render children?.()}
</svelte:element>
