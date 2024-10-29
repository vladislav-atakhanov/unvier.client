<script module lang="ts">
    const ROUTER_KEY = Symbol()

    export const useRouter = () => getContext<HistoryRouter>(ROUTER_KEY)
</script>

<script lang="ts">
    import { getContext, onMount, setContext, type Snippet, tick, } from "svelte"
    import { debounce, findClosest, hostMatches, shouldNavigate } from "./utils"
    import { HistoryRouter, ItemRouter } from "./router.svelte.ts"
    import type { Router } from "./@types.ts"
    import { useApp } from "../../app.svelte"
    import { sleep } from "$lib/utils.ts"
    let {
        children, home="/", drawer, navigation
    }: {
        children?: Snippet<[Router]>,
        drawer?: Snippet,
        navigation?: Snippet
        home?: string
    } = $props()

    const router = new HistoryRouter(home)
    const app = useApp()
    app.router = router
    router.app = app
    setContext(ROUTER_KEY, router)

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
            hostMatches(anchor.href) &&
            shouldNavigate(event) &&
            !anchor.hasAttribute("noroute")
        ) {
            event.preventDefault()

            const mode = anchor.getAttribute("mode") ?? "push"
            router.navigate(anchor.pathname, { mode })
            return
        }
    }

    const routerEnd = debounce(() => tick().then(() => router.onScrollEnd()), 100)

    const onscroll = () => {
        routerEnd()
        router.onscroll()
    }

    const scrollToLastPage = () => {
        if (!drawer) return
        const pages = router.element?.querySelectorAll(".page") ?? []
        const page = pages[pages.length - 1] as HTMLElement

        if (!page) return
        if (page.dataset.page) return
        const {x} = page.getBoundingClientRect()
        if (x <= 0) {
            sleep(1).then(scrollToLastPage)
            return
        }
        router.element?.scrollTo({
            left: x,
            behavior: "instant"
        })
    }

    onMount(() => tick().then(scrollToLastPage))


</script>



<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
    onclick={links}
    class="router flex w-full overflow-x-auto items-start relative"
    bind:this={router.element}
    {onscroll}
>
    {@render drawer?.()}
    {#each router.history as item}
        {@render children?.(new ItemRouter(router, item))}
    {/each}
    {@render navigation?.()}
</div>

<style>
    .router {
        scroll-snap-type: x mandatory;
        scrollbar-width: none;
    }
    .router > :global(*) {
        scroll-snap-align: start;
        scroll-snap-stop: always;
    }
</style>
