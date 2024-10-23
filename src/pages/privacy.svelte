<script>
    import { fetchPrivacy } from "$api"
    import Page from "$lib/layouts/page.svelte"
    import { onMount } from "svelte"
    import { _ } from "$lib/i18n/index.ts"
    import AppBar from "$lib/components/app-bar.svelte"

    let privacy = $state("")
    onMount(() => {
        fetchPrivacy().then((p) => (privacy = p))
    })
</script>

<Page>
    {#snippet header()}
        <AppBar title={_("privacy-policy")}>

        </AppBar>
    {/snippet}
    <div class="content max-w-3xl mx-auto pt-6">
        {#if privacy}
            {@html privacy}
        {/if}
    </div>
</Page>

