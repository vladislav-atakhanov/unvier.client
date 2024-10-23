<script module lang="ts">
    const ROUTER_KEY = Symbol()

    export const useRouter = () => getContext<HistoryRouter>(ROUTER_KEY)
</script>

<script lang="ts">
    import { getContext, setContext, type Snippet, tick, } from "svelte"
    import { debounce, findClosest, hostMatches, shouldNavigate } from "./utils"
    import { HistoryRouter, ItemRouter } from "./router.svelte.ts"
    import type { Router } from "./@types.ts"
    let {
        children, home="/"
    }: {
        children?: Snippet<[Router]>,
        home?: string
    } = $props()

    const router = new HistoryRouter(home)
    setContext(ROUTER_KEY, router)

    $inspect(router.history).with((type, value) => {
        console.log("history", type, '[',value.map(({path, query, fragment}) => {
            if (query) {
                path += `?${query}`
            }
            if (fragment) {
                path += `#${fragment}`
            }
            return path
        }).join(", "), ']');
    })


    const links: (event: any) => void = (event: PointerEvent) => {
        const anchor = findClosest<HTMLAnchorElement>("A", event.target as any)
        if (!anchor) return
        if (anchor.hash) {
            event.preventDefault()
            event.stopPropagation()

            const target = document.querySelector(anchor.hash) as HTMLElement
            if (target) {
                target.scrollIntoView({ behavior: "smooth" })
            }
            return
        }
        if (
            (anchor.target === "" || anchor.target === "_self") &&
            hostMatches(anchor) &&
            shouldNavigate(event) &&
            !anchor.hasAttribute("noroute")
        ) {
            event.preventDefault()

            router.navigate(anchor.pathname, { mode: "push" })
            return
        }
    }

    const onscroll = debounce(() => tick().then(() => {
        if (!router.element) return
        const screenWidth = router.element.clientWidth / (router.history.length - 1);
        const index = Math.round(router.element.scrollLeft / screenWidth)
        if (index + 1 !== router.history.length)
            router.history = router.history.slice(0, index + 1)
    }), 100)


</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div onclick={links} class="router" bind:this={router.element} {onscroll}>
    {#each router.history as item}
        {@render children?.(new ItemRouter(router, item))}
    {/each}
</div>

<style>
    .router {
        display: flex;
        width: 100vw;
        overflow-x: scroll;

        scroll-snap-type: x mandatory;
    }
    .router > :global(*) {
        width: 100vw;
        flex: 0 0 100vw;

        scroll-snap-align: start;
        scroll-snap-stop: always;
    }
</style>
