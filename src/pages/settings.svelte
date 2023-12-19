<script>
    import { Scaffold, AppBar, FilledButton } from "material/components"
    import Navigation from "../components/navigation.svelte"
    import WriteMe from "../components/write-me.svelte"
    import SchemeSwitcher from "../components/scheme-switcher.svelte"
    import { checkAuth } from "../api"
    import { onMount } from "svelte"

    let isAuth = false
    onMount(async () => {
        isAuth = await checkAuth()
    })

    const back = () => {
        history?.back()
    }
</script>

<Scaffold>
    <AppBar slot="app-bar" canBack={true} {back}
        >Настройки
        <div slot="actions" class="settings__write-me"><WriteMe /></div>
    </AppBar>
    <div class="settings__container">
        <div class="settings__switcher">
            Тема
            <SchemeSwitcher />
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
    }
    .settings__switcher {
        margin-bottom: 1em;
        display: grid;
        gap: 0.5em;
    }
</style>
