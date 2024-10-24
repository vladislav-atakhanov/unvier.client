<script>
    import AppBar from "$lib/components/app-bar.svelte"


    import { _ } from "$lib/i18n"
    import Page from "$lib/layouts/page.svelte"

</script>
<Page>
    {#snippet header()}
        <AppBar title={_("schedule")}>

        </AppBar>
    {/snippet}
</Page>