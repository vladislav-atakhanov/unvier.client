<script>
    import { fetchFAQ } from "$api"
    import AppBar from "$lib/components/app-bar.svelte"
    import { Button } from "$lib/components/ui/button"
    import { _ }from "$lib/i18n"
    import Page from "$lib/layouts/page.svelte"
    import { routes } from "../url"
</script>

<Page>
    {#snippet header()}
        <AppBar title={_("faq")} />
    {/snippet}

    <div class="grid mx-auto p-4 gap-2 max-w-md">
        {#await fetchFAQ()}
            {_("loading")}
        {:then faq}
            {#each faq as {id, label} (id)}
                <Button href="{routes.faq}/{id}" variant="outline" class="justify-start whitespace-normal h-auto">
                    {label}
                </Button>
            {/each}
        {/await}
    </div>
</Page>
