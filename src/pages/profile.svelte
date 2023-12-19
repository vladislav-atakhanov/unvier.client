<script>
    import {
        Scaffold,
        AppBar,
        FilledButton,
        IconButton,
    } from "material/components"
    import { logout } from "../api"
    import Navigation from "../components/navigation.svelte"
    import { onMount } from "svelte"
    import { LOGIN, SETTINGS } from "../url"
    import { navigate } from "material"

    import { i18n } from "material/i18n"
    const _ = i18n()

    let username = ""
    onMount(() => {
        username = localStorage.getItem("username") || ""
    })

    const onClick = () => {
        logout()
        navigate(LOGIN)
    }
</script>

<Scaffold>
    <AppBar slot="app-bar"
        >{_("profile")}
        <IconButton slot="actions" icon="settings" href={SETTINGS} />
    </AppBar>
    <div class="profile__container">
        <div class="profile__content"><p>{_("username")}: {username}</p></div>
        <FilledButton on:click={onClick}>{_("logout")}</FilledButton>
    </div>

    <Navigation slot="navigation-bar" />
</Scaffold>

<style>
    :global(md-filled-button) {
        display: block;
    }
    .profile__container {
        margin: 0 auto;
        max-width: 500px;
        display: grid;
        grid-template-rows: 1fr max-content;
        height: 100%;
        padding-bottom: 1em;
    }
    p {
        margin: 0;
    }
</style>
