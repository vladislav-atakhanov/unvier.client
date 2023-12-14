<script>
    import { Scaffold, AppBar } from "material/components"
    import { logout } from "../api"
    import Navigation from "../components/navigation.svelte"
</script>

<Scaffold>
    <AppBar slot="app-bar">Профиль</AppBar>
    <button on:click={logout}>Выйти</button>
    <Navigation slot="navigation-bar" />
</Scaffold>

<style>
    button {
        display: block;
        width: 100%;
    }
</style>
