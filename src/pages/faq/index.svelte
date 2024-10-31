<script>
    import { useApi } from "$api"
    import AppBar from "$lib/components/app-bar.svelte"
    import Card from "$lib/components/ui/card"
    import { Skeleton } from "$lib/components/ui/skeleton"
    import { _ }from "$lib/i18n"
    import Page from "$lib/layouts/page.svelte"
    import { nullish, randInt } from "$lib/utils"
    import { routes } from "../url"

    const api = useApi()
    const query = api.fetchFAQ()
</script>

<Page>
    {#snippet header()}
        <AppBar title={_("faq")} />
    {/snippet}

    <div class="grid mx-auto p-2 gap-2 max-w-md">
        {#if query.loading}
            {#each {length: 8} as _}
                <Card>
                    {#snippet title()}
                        <Skeleton symbols={randInt(20, 50)} />
                    {/snippet}
                </Card>
            {/each}
        {:else if !nullish(query.data)}
            {#each query.data as {id, label} (id)}
                <Card href="{routes.faq}/{id}" title={label} />
            {:else}
                {_("no-data")}
            {/each}
        {/if}
    </div>
</Page>
