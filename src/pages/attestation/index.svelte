<script>
    import AppBar from "$lib/components/app-bar.svelte"
    import { _ }from "$lib/i18n"
    import Page from "$lib/layouts/page.svelte"
</script>

<Page>
    {#snippet header()}
        <AppBar title={_("attestation")} />
    {/snippet}

    <div class="grid mx-auto p-4 gap-2 max-w-md">{_("attestation")}</div>
</Page>
