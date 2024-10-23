<script lang="ts">
    import { checkAuth } from "$api"
    import colorScheme from "$lib/color-scheme"
    import Wrapper, {type Router} from "$lib/router"
    import { routes } from "./pages"
    import Faq from "./pages/faq.svelte"
    import Login from "./pages/login.svelte"
    import Privacy from "./pages/privacy.svelte"
    import Settings from "./pages/settings.svelte"

    const isAuth = (router: Router) => {
        if (checkAuth() === false) {
            router.navigate(routes.login, {mode: "replace"})
        }
        return true
    }


</script>

<svelte:body use:colorScheme.apply />

<Wrapper home={routes.home}>
    {#snippet children(router)}
    {#if router.pattern(routes.login)}
        <Login />
    {:else if router.pattern(routes.settings)}
        <Settings />
    {:else if router.pattern(routes.privacy)}
        <Privacy />
    {:else if router.pattern(routes.schedule) && isAuth(router)}
        Schedule
    {/if}
    {/snippet}
</Wrapper>