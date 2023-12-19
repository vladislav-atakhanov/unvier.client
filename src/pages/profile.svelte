<script>
    import { Scaffold, AppBar, FilledButton } from "material/components"
    import { logout } from "../api"
    import Navigation from "../components/navigation.svelte"
    import { onMount } from "svelte"
    import IconButton from "material/components/buttons/icon-button.svelte"
    import { SETTINGS } from "../url"

    let username = ""
    onMount(() => {
        username = localStorage.getItem("username") || ""
    })
</script>

<Scaffold>
    <AppBar slot="app-bar"
        >Профиль
        <IconButton slot="actions" icon="settings" href={SETTINGS} />
    </AppBar>
    <div class="profile__container">
        <div class="profile__content"><p>Логин: {username}</p></div>
        <FilledButton on:click={logout}>Выйти</FilledButton>
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
