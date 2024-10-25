<script lang="ts">
    import { fetchFAQItem } from "$api/faq"
    import AppBar from "$lib/components/app-bar.svelte"
    import Loader from "$lib/components/loader.svelte"
    import { _, i18n } from "$lib/i18n"
    import Page from "$lib/layouts/page.svelte"
    import { tick } from "svelte"

    let {id}: {id: string} = $props()

    let promise = $derived(fetchFAQItem(id, i18n.language))
    let title = $state(_("loading"))
    let content: HTMLElement

    $effect(() => {
        promise.then(() => tick().then(() => {
            title = content.querySelector("h1")?.textContent ?? _("faq")
        }))
    })
</script>

<Page>
    {#snippet header()}
        <AppBar title={title} />
    {/snippet}

    <div class="content mx-auto p-4 max-w-3xl" bind:this={content}>
        {#await promise}
            <Loader />
        {:then text}
            {@html text}
        {/await}
    </div>
</Page>
