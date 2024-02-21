<script>
    import { Scaffold, AppBar } from "material/components"
    import Navigation from "../components/navigation.svelte"
    import { useFAQ } from "../api"
    import LoadingText from "../components/loading-text.svelte"
    import Card from "../components/card.svelte"
    import { i18n } from "material/i18n"
    import { FAQ } from "../url"
    const _ = i18n()
    const [faq, loading] = useFAQ()
</script>

<Scaffold>
    <AppBar slot="app-bar" canBack={true}>
        <LoadingText {loading} title={_("faq")} />
    </AppBar>
    {#if $faq}
        <ul class="faq">
            {#each $faq as { id, label }}
                <li class="faq__item">
                    <Card title={label} href="{FAQ}/{id}" />
                </li>
            {/each}
        </ul>
    {/if}
    <Navigation slot="navigation-bar" />
</Scaffold>

<style>
    .faq {
        display: grid;
        gap: 1em;
        max-width: 500px;
        list-style: none;
        padding: 0;
        margin: 0 auto;
    }
</style>
