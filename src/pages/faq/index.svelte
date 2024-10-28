<script>
    import { useApi } from "$api"
    import AppBar from "$lib/components/app-bar.svelte"
    import Loader from "$lib/components/loader.svelte"
    import { Button } from "$lib/components/ui/button"
    import Card from "$lib/components/ui/card"
    import { _, i18n }from "$lib/i18n"
    import Page from "$lib/layouts/page.svelte"
    import { routes } from "../url"

    const api = useApi()
    const query = api.fetchFAQ()
</script>

<Page>
    {#snippet header()}
        <AppBar title={_("faq")} />
    {/snippet}

    <div class="grid mx-auto py-4 px-2 gap-2 max-w-md">
        {#if query.loading }
            <Loader />
        {:else if query.data}
            {#each query.data as {id, label} (id)}
                <Card href="{routes.faq}/{id}" title={label} />
            {/each}
        {/if}
    </div>
</Page>
