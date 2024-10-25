<script module lang="ts">
    import { getContext } from "svelte"
    import { useQuery } from "$lib/query"
    import { BadRequest, NotFound, RequestTimeout, ServerError, Unauthorized } from "$api/errors"

    const KEY = Symbol()


    const addSnack = console.log

    export class App {
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
        #catch(error: unknown) {
            if (error instanceof Unauthorized) {
                addSnack(_("error.invalid-credentials"))
                this.router?.navigate(routes.login, { mode: "replace" })
                logout()
            } else if (error instanceof BadRequest) {
                addSnack(_("version.update-required"))
            } else if (error instanceof NotFound || error instanceof ServerError) {
                addSnack(_("error.server-error"))
            } else if (error instanceof RequestTimeout) {
                addSnack(_("error.univer-error"))
            } else if (error instanceof Error) {
                addSnack(_("error.unknown-error", error.message))
            }
        }
        query = $derived(<T>(promise: Parameters<typeof useQuery<T>>["0"]) => {
            if (!i18n.language) return new Promise<T>(() => {})
            return useQuery<T>(promise, {
                onReject: (error) => this.#catch(error)
            })
        })
    }
    export const useApp = () => getContext<App>(KEY)
</script>

<script lang="ts">
    import { checkAuth, logout } from "$api"
    import colorScheme from "$lib/color-scheme"
    import Drawer from "$lib/components/drawer.svelte"
    import { _, i18n } from "$lib/i18n"
    import Wrapper, {type Router} from "$lib/router"
    import { setContext } from "svelte"
    import { routes } from "./pages"
    import Faq from "./pages/faq/index.svelte"
    import FaqItem from "./pages/faq/item.svelte"
    import Login from "./pages/login.svelte"
    import Privacy from "./pages/privacy.svelte"
    import Schedule from "./pages/schedule.svelte"
    import Settings from "./pages/settings.svelte"

    const isAuth = (router: Router, navigate=false) => {
        if (checkAuth() === false) {
            router.navigate(routes.login, {mode: "replace"})
            return false
        }
        if (navigate) {
            router.navigate(routes.home, {mode: "replace"})
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
    {#if router.pattern(routes.login) && !isAuth(router, true)}
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