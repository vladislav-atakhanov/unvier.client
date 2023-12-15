<script>
    import { Scaffold, AppBar, FilledButton } from "material/components"
    import { logout } from "../api"
    import Navigation from "../components/navigation.svelte"
    import { onMount } from "svelte"
    import WriteMe from "../components/write-me.svelte"

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
    <p>Логин: {username}</p>

    <FilledButton on:click={logout}>Выйти</FilledButton>

    <Navigation slot="navigation-bar" />
</Scaffold>

<style>
    :global(md-filled-button) {
        display: block;
    }
    .profile__write-me {
        font-size: 2em;
    }
</style>
