<script>
    import { Scaffold, AppBar } from "material/components"
    import Navigation from "../components/navigation.svelte"
    import { useUmkd } from "../api"
    import LoadingText from "../components/loading-text.svelte"
    import { i18n } from "material/i18n"
    import { UMKD } from "../url"
    import Card from "../components/card.svelte"
    const _ = i18n()
    const [umkd, loading] = useUmkd()
</script>

<Scaffold>
    <AppBar slot="app-bar">
        <LoadingText {loading} title={_("umkd")} />
    </AppBar>
    {#if $umkd}
        <div class="umkd">
            {#each $umkd as { id, subject, type }}
                <Card href="{UMKD}/{id}" title={subject}>
                    <div class="folder__type">{type}</div>
                </Card>
            {/each}
        </div>
    {/if}
    <Navigation slot="navigation-bar" />
</Scaffold>

<style>
    .umkd {
        display: grid;
        gap: 1em;
        max-width: 500px;
        margin: 0 auto;
    }
    .folder__type {
        opacity: 0.7;
    }
</style>
