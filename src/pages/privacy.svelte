<script>
    import { fetchPrivacy } from "$api"
    import Page from "$lib/layouts/page.svelte"
    import { _, i18n } from "$lib/i18n/index.ts"
    import AppBar from "$lib/components/app-bar.svelte"
    import Loader from "$lib/components/loader.svelte"
</script>

<Page>
    {#snippet header()}
        <AppBar title={_("privacy-policy")}>

        </AppBar>
    {/snippet}
    <div class="content max-w-3xl mx-auto p-4">
        {#await fetchPrivacy(i18n.language)}
            <Loader />
        {:then privacy}
            {@html privacy}
        {/await}
    </div>
</Page>

