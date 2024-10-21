<script module lang="ts">
    const ROUTER_KEY = Symbol()
    export const useRouter = () => getContext<{
        readonly history: string[]
        readonly navigate: Navigate
        readonly back: () => void
    }>(ROUTER_KEY)
</script>

<script lang="ts">
    import { getContext, setContext } from "svelte"
    import type { Route, Routes, Navigate } from "./@types"
    import { debounce, hostMatches, next, shouldNavigate } from "./utils"
    let {
        routes,
        home = routes.home,
    }: {
        routes: ReturnType<typeof Routes>
        home?: Route
    } = $props()
    let history = $state<string[]>([home.path])
    let router = $state<HTMLElement>()


    const navigate: Navigate = (route, { mode } = { mode: "push" }) => {
        next(() => {
            if (mode === "replace") {
                history = [route.path]
            } else {
                if (history.includes(route.path) === false)
                    history.push(route.path)
            }
            next(() => {
                router?.scrollTo({
                    left: router?.scrollWidth,
                    behavior: "smooth",
                })
            })
        })
    }

    const getComponentByPath = (path: string) => {
        const route = Object.values(routes).find((value) => value.path === path)
        if (typeof route !== "object") return

        let isRender = false
        const render = () => {
            isRender = true
        }
        if (!route.middleware) return route.component
        route.middleware({ render, navigate })
        if (isRender) return route.component
    }

    $inspect(history)

    const findClosest = <T extends HTMLElement>(
        tagName: string,
        el: HTMLElement,
    ): T => {
        while (el && el.tagName !== tagName) el = el.parentNode
        return el as T
    }
    const links = (event: PointerEvent) => {
        const anchor = findClosest<HTMLAnchorElement>("A", event.target as any)
        if (!anchor) return
        if (anchor.hash) {
            event.preventDefault()
            event.stopPropagation()

            /** @type {HTMLElement} */
            const element = document.querySelector(anchor.hash)
            if (element) {
                element.scrollIntoView({ behavior: "smooth" })
                console.log("click")
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

            navigate(routes.get(anchor.pathname), { mode: "push" })
            return
        }
    }

    const onscroll = debounce(() => next(() => {
        if (!router) return
        const screenWidth = router.clientWidth / (history.length - 1);
        const index = Math.round(router.scrollLeft / screenWidth)
        history = history.slice(0, index + 1)
    }), 100)

    setContext(ROUTER_KEY, {
        get history() {
            return history
        },
        navigate,
        back() {
            if (!router) return
            const screenWidth = router.clientWidth / (history.length - 1);
            router?.scrollTo({
                left: router.scrollLeft - screenWidth,
                behavior: "smooth"
            })
        }
    })
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div onclick={links} class="router" bind:this={router} {onscroll}>
    {#each history as path}
        {@const Component = getComponentByPath(path)}
        {#if Component}
            <Component />
        {:else}
            Not found
        {/if}
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
