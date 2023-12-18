<script>
    import { Scaffold, AppBar, FilledButton } from "material/components"
    import { logout } from "../api"
    import Navigation from "../components/navigation.svelte"
    import { onMount } from "svelte"
    import WriteMe from "../components/write-me.svelte"
    import SchemeSwitcher from "../components/scheme-switcher.svelte"

    let username = ""
    onMount(() => {
        username = localStorage.getItem("username") || ""
    })
</script>

<Scaffold>
    <AppBar slot="app-bar"
        >Профиль
        <div slot="actions" class="profile__write-me"><WriteMe /></div>
    </AppBar>
    <div class="profile__container">
        <p>Логин: {username}</p>
        <div class="profile__switcher"><SchemeSwitcher /></div>
        <FilledButton on:click={logout}>Выйти</FilledButton>
    </div>

    <Navigation slot="navigation-bar" />
</Scaffold>

<style>
    :global(md-filled-button) {
        display: block;
    }
    .profile__write-me {
        font-size: 2em;
    }
    .profile__container {
        margin: 0 auto;
        max-width: 500px;
    }
    .profile__switcher {
        margin-bottom: 1em;
    }
</style>
