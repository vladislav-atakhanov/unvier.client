<script lang="ts">
    import { useApi } from "$api"
    import AppBar from "$lib/components/app-bar.svelte"
    import Loader from "$lib/components/loader.svelte"
    import Card from "$lib/components/ui/card"
    import { _ }from "$lib/i18n"
    import Page from "$lib/layouts/page.svelte"
    import { nullish } from "$lib/utils"
    import { routes } from "../url"


    const api = useApi()
    const query = api.fetchFolders()
</script>

<Page>
    {#snippet header()}
        <AppBar>
            {#snippet title()}
            {#if query.state === "update"}
                {_("updating")}
            {:else}
                {_("umkd")}
            {/if}
            {/snippet}
        </AppBar>
    {/snippet}

    <div class="grid mx-auto p-2 gap-2 max-w-md">
        {#if query.state === "load" }
            <Loader />
        {:else if !nullish(query.data)}
            {#each query.data as {id, subject, type} (id)}
                <Card title={subject} href="{routes.files}/{id}">
                    <p class="opacity-70">{type}</p>
                </Card>
            {:else}
                {_("no-data")}
            {/each}
        {/if}
    </div>
</Page>
