<script lang="ts">
    import { subject, useApi } from "$api"
    import AppBar from "$lib/components/app-bar.svelte"
    import Loader from "$lib/components/loader.svelte"
    import TeacherLink from "$lib/components/teacher-link.svelte"
    import { Card } from "$lib/components/ui/card"
    import { Skeleton } from "$lib/components/ui/skeleton"
    import { _, i18n } from "$lib/i18n"
    import Page from "$lib/layouts/page.svelte"
    import { groupBy, nullish, randInt } from "$lib/utils"
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

    <div class="mx-auto p-2 max-w-md grid gap-2">
        {#if nullish(query.data)}
            {#each {length: 8} as _}
                <Card>
                    {#snippet title()}
                        <Skeleton symbols={subject()} />
                    {/snippet}
                    <p><Skeleton symbols={randInt(10, 30)} /></p>
                    <div><Skeleton symbols={randInt(15, 25)} /></div>
                    <div class="flex justify-end">
                        <Skeleton symbols={randInt(15, 30)} />
                    </div>
                </Card>
            {/each}
        {:else}
            {@const groups = groupBy(query.data, ({teacher}) => teacher)}
            {#each groups.entries() as [key, files] (key)}
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
