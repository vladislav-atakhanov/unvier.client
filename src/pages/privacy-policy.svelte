<script>
    import { Scaffold, AppBar } from "material/components"
    import Navigation from "../components/navigation.svelte"
    import { checkAuth, usePrivacyPolicy } from "../api"
    import { onMount } from "svelte"
    import { i18n } from "material/i18n"
    import LoadingText from "../components/loading-text.svelte"

    let isAuth = false
    onMount(async () => {
        isAuth = await checkAuth()
    })

    const [privacy, loading] = usePrivacyPolicy()
    const _ = i18n()
    const back = () => history?.back()
</script>

<Scaffold>
    <AppBar slot="app-bar" canBack={true} {back}
        ><LoadingText {loading}>{_("privacy-policy")}</LoadingText></AppBar
    >
    <div class="privacy__container">
        {#if $privacy}
            {@html $privacy}
        {/if}
    </div>

    <svelte:fragment slot="navigation-bar">
        {#if isAuth}
            <Navigation />
        {/if}
    </svelte:fragment>
</Scaffold>

<style>
    .privacy__container {
        margin: 0 auto;
        max-width: 700px;
    }
    .privacy__container :global(a) {
        color: var(--md-sys-color-primary);
    }
    .privacy__container :global(a:hover) {
        text-decoration: none;
    }
</style>
