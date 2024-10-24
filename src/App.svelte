<script module lang="ts">
    import { getContext } from "svelte"

    const KEY = Symbol()
    class App {
        drawer = $state<HTMLElement>()
        router = $state<Router>()
        drawerState = $state<"open" | "close">("close")
        #openDrawer() {
            this.drawerState = "open"
            this.router?.element?.scrollTo({
                behavior: "smooth",
                left: 0
            })
        }
        #closeDrawer() {
            this.drawerState = "close"
            this.router?.element?.scrollTo({
                behavior: "smooth",
                left: this.drawer?.clientWidth
            })
        }
        toggleDrawer() {
            this.drawerState === "close" ? this.#openDrawer() : this.#closeDrawer()
        }
    }
    export const useApp = () => getContext<App>(KEY)
</script>

<script lang="ts">
    import { checkAuth } from "$api"
    import colorScheme from "$lib/color-scheme"
    import Drawer from "$lib/components/drawer.svelte"
    import { i18n } from "$lib/i18n"
    import Wrapper, {type Router} from "$lib/router"
    import { setContext } from "svelte"
    import { routes } from "./pages"
    import Faq from "./pages/faq/index.svelte"
    import FaqItem from "./pages/faq/item.svelte"
    import Login from "./pages/login.svelte"
    import Privacy from "./pages/privacy.svelte"
    import Schedule from "./pages/schedule.svelte"
    import Settings from "./pages/settings.svelte"

    const isAuth = (router: Router) => {
        if (checkAuth() === false) {
            router.navigate(routes.login, {mode: "replace"})
        }
        return true
    }
    const app = new App()
    setContext(KEY, app)

</script>

<svelte:body use:colorScheme.apply use:i18n.apply />

<Wrapper home={routes.home}>
    {#snippet drawer()}
    {#if checkAuth()}
        <Drawer />
    {/if}
    {/snippet}
    {#snippet children(router)}
    {@const faqParams = router.pattern(routes.faqItem)}
    {#if router.pattern(routes.login)}
        <Login />
    {:else if router.pattern(routes.settings)}
        <Settings />
    {:else if router.pattern(routes.privacy)}
        <Privacy />
    {:else if router.pattern(routes.schedule) && isAuth(router)}
        <Schedule />
    {:else if router.pattern(routes.faq)}
        <Faq />
    {:else if faqParams}
        <FaqItem id={faqParams.id} />
    {/if}
    {/snippet}
</Wrapper>