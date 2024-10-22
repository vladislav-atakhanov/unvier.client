<script>
    import { fetchPrivacy } from "$api"
    import Page from "../layouts/page.svelte"
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
    <div class="privacy max-w-3xl mx-auto pt-6">
        {#if privacy}
            {@html privacy}
        {/if}
    </div>
</Page>

<style>
    .privacy :global(h1) {
        @apply text-3xl font-bold my-5
    }
    .privacy :global(p) {
        @apply my-4
    }
    .privacy :global(a) {
        @apply text-primary underline hover:no-underline
    }
</style>
