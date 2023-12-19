<script>
    import { Scaffold, AppBar } from "material/components"
    import Navigation from "../components/navigation.svelte"
    import WriteMe from "../components/write-me.svelte"
    import SchemeSwitcher from "../components/scheme-switcher.svelte"
    import { checkAuth } from "../api"
    import { onMount } from "svelte"
    import LanguageSwitcher from "../components/language-switcher.svelte"
    import { i18n } from "material/i18n"

    let isAuth = false
    onMount(async () => {
        isAuth = await checkAuth()
    })

    const back = () => {
        history?.back()
    }

    const _ = i18n()
</script>

<Scaffold>
    <AppBar slot="app-bar" canBack={true} {back}
        >{_("settings")}
        <div slot="actions" class="settings__write-me"><WriteMe /></div>
    </AppBar>
    <div class="settings__container">
        <div class="settings__switcher">
            {_("color-scheme")}
            <SchemeSwitcher />
        </div>
        <div class="settings__switcher">
            {_("language")}
            <LanguageSwitcher />
        </div>
    </div>

    <svelte:fragment slot="navigation-bar">
        {#if isAuth}
            <Navigation />
        {/if}
    </svelte:fragment>
</Scaffold>

<style>
    :global(md-filled-button) {
        display: block;
    }
    .settings__write-me {
        font-size: 2em;
    }
    .settings__container {
        margin: 0 auto;
        max-width: 500px;
        display: grid;
        gap: 1em;
    }
    .settings__switcher {
        display: grid;
        gap: 0.5em;
    }
</style>
