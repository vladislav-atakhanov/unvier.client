<script module lang="ts">
    import { getContext, onMount, tick } from "svelte"

    const APP = Symbol()
    export class App {
        drawer = $state<HTMLElement>()
        navigationHeight = $state(0)
        router = $state<Router>()
        drawerState = $state<"open" | "close">("close")
        isAuth = $state(false)
        api: Api

        themeColor = $state<string>()
        updateThemeColor(..._: unknown[]) {
            tick().then(() => {
                const pages = document.querySelectorAll(".page")
                const page = pages[pages.length - 1]
                const header = page?.querySelector("header.header")
                if (!header) return
                const background = getComputedStyle(header).getPropertyValue("background-color")
                this.themeColor = background
            })

            return () => this.updateThemeColor()
        }
        constructor() {
            this.api = new Api(this)
        }
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
        logout() {
            this.api.logout()
            this.router?.navigate(routes.login, { mode: "replace" })
            this.isAuth = false
        }
    }
    export const useApp = () => getContext<App>(APP)
</script>

<script lang="ts">
    import { Api, setApi } from "$api"
    import colorScheme from "$lib/color-scheme"
    import Drawer from "$lib/components/drawer.svelte"
    import { _, i18n } from "$lib/i18n"
    import Wrapper, {type Router} from "$lib/router"
    import { setContext } from "svelte"
    import { routes } from "./pages"
    import Faq from "./pages/faq/index.svelte"
    import Attestation from "./pages/attestation/index.svelte"
    import FaqItem from "./pages/faq/item.svelte"
    import Login from "./pages/login.svelte"
    import Privacy from "./pages/privacy.svelte"
    import Schedule from "./pages/schedule.svelte"
    import Settings from "./pages/settings.svelte"
    import { Toaster } from "$lib/components/ui/sonner";
    import Profile from "./pages/profile.svelte"
    import Navigation from "$lib/components/navigation.svelte"
    import Calculator from "./pages/calculator.svelte"
    import Exams from "./pages/exams.svelte"

    const app = new App()
    const isAuth = (router: Router, navigate=false) => {
        const auth = app.api.checkAuth()
        if (!auth) {
            router.navigate(routes.login, {mode: "replace"})
            return auth
        }
        if (navigate) {
            router.navigate(routes.home, {mode: "replace"})
        }
        return auth
    }
    onMount(() => {
        app.isAuth = app.api.checkAuth()
    })
    setContext(APP, app)
    setApi(app.api)

    $effect(() => app.updateThemeColor(colorScheme.scheme))
</script>

<svelte:body use:colorScheme.apply use:i18n.apply />
<svelte:head>
    {#if app.themeColor}
        <meta name="msapplication-TileColor" content={app.themeColor} />
        <meta name="theme-color" content={app.themeColor} />
    {/if}
</svelte:head>
<Toaster />

<Wrapper home={routes.home}>
    {#snippet drawer()}
    {#if app.isAuth}
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
    {:else if router.pattern(routes.profile) && isAuth(router)}
        <Profile />
    {:else if router.pattern(routes.attestation) && isAuth(router)}
        <Attestation />
    {:else if router.pattern(routes.calculator) && isAuth(router)}
        <Calculator />
    {:else if router.pattern(routes.faq)}
        <Faq />
    {:else if router.pattern(routes.exams)}
        <Exams />
    {:else if faqParams}
        <FaqItem id={faqParams.id} />
    {/if}
    {/snippet}
    {#snippet navigation()}
    {#if app.isAuth}
        <div bind:clientHeight={app.navigationHeight} class="fixed bottom-0 left-0 right-0 "><Navigation /></div>
    {/if}
    {/snippet}
</Wrapper>
