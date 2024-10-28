<script lang="ts">
    import { useApi } from "$api"
    import AppBar from "$lib/components/app-bar.svelte"
    import Loader from "$lib/components/loader.svelte"
    import TeacherLink from "$lib/components/teacher-link.svelte"
    import { Card } from "$lib/components/ui/card"
    import { _, i18n } from "$lib/i18n"
    import Page from "$lib/layouts/page.svelte"
    import { Download } from "lucide-svelte"
    import { toast } from "svelte-sonner"

    let {id}: {id: string} = $props()
    const api = useApi()
    const query = api.fetchFiles(id)
    const folders = api.fetchFolders()


    let dtf = $derived(new Intl.DateTimeFormat(i18n.language, {
        month: "long",
        day: "numeric",
        year: "numeric",
    }))

    let title = $state(_("umkd"))
    $effect(() => {
        title = folders.data?.find(({id: i}) => id.toString() === i)?.subject ?? _("umkd")
    })
</script>

<Page>
    {#snippet header()}
        <AppBar title={title} onTitleClick={(title) => toast(title)} />
    {/snippet}

    <div class="mx-auto p-2 max-w-3xl grid gap-2">
        {#if query.loading}
            <Loader />
        {:else if query.data}
            {@const groups = Map.groupBy(query.data, ({teacher}) => teacher)}
            {#each groups as [key, files] (key)}
                <TeacherLink {...files[0]} class="px-2" />
                {#each files as { date, description, downloads_count, language, name, size, type, url }}
                    <Card href={api.url(url)} title={name}>
                        {#if type}<p>{type}</p>{/if}
                        <div>{dtf.format(date * 1000)}</div>
                        {#if description.length > 0}
                            <p>{description}</p>
                        {/if}
                        {#if language}
                            <p>{language}</p>
                        {/if}
                        <div class="flex items-center justify-end gap-2">
                            {size}
                            <Download />
                            {#if downloads_count > 0}{downloads_count}{/if}
                        </div>
                    </Card>
                {/each}
            {/each}
        {/if}
    </div>
</Page>
