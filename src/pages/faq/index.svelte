<script>
    import { fetchFAQ } from "$api"
    import AppBar from "$lib/components/app-bar.svelte"
    import Loader from "$lib/components/loader.svelte"
    import { Button } from "$lib/components/ui/button"
    import { _, i18n }from "$lib/i18n"
    import Page from "$lib/layouts/page.svelte"
    import { routes } from "../url"
</script>

<Page>
    {#snippet header()}
        <AppBar title={_("faq")} />
    {/snippet}

    <div class="grid mx-auto p-4 gap-2 max-w-md">
        {#await fetchFAQ(i18n.language)}
            <Loader />
        {:then faq}
            {#each faq as {id, label} (id)}
                <Button href="{routes.faq}/{id}" variant="outline" class="justify-start whitespace-normal h-auto">
                    {label}
                </Button>
            {/each}
        {/await}
    </div>
</Page>
