<script>
    import AppBar from "$lib/components/app-bar.svelte"
    import { Button } from "$lib/components/ui/button"
    import { Calculator } from "lucide-svelte"
    import { _ }from "$lib/i18n"
    import Page from "$lib/layouts/page.svelte"
    import { routes } from "../url"
</script>

<Page>
    {#snippet header()}
        <AppBar title={_("attestation")}>
            {#snippet right()}
                <Button size="icon" href={routes.calculator} variant="ghost">
                    <Calculator />
                </Button>
            {/snippet}
        </AppBar>
    {/snippet}

    <div class="grid mx-auto p-4 gap-2 max-w-md">{_("attestation")}</div>
</Page>
