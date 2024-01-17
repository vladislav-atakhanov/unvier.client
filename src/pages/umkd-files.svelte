<script>
    import { Scaffold, AppBar, Icon } from "material/components"
    import Navigation from "../components/navigation.svelte"
    import { useUmkd } from "../api"
    import LoadingText from "../components/loading-text.svelte"
    import { i18n, language } from "material/i18n"
    import { onMount } from "svelte"
    import { fetchUmkdFiles } from "../api/umkd"
    import Card from "../components/card.svelte"
    import TeacherLink from "../components/teacher-link.svelte"
    import { groupBy } from "../utils"
    import { api } from "../api/config"
    import { authFetchUrl, token } from "../api/auth"
    const _ = i18n()
    const [umkd, loading] = useUmkd()

    /** @type {string} */
    export let id

    let filesLoading = true

    /** @type {import("../@types").UmkdFile[]} */
    let files = []
    onMount(() => {
        fetchUmkdFiles(id).then((f) => {
            files = f
            filesLoading = false
        })
        return () => (filesLoading = true)
    })

    $: title = $umkd?.find(({ id: i }) => id === i)?.subject || _("umkd")

    $: dtf = new Intl.DateTimeFormat($language, {
        month: "long",
        day: "numeric",
        year: "numeric",
    })

    $: grouped = groupBy(files, "teacher")

    /**
     *
     * @param {string} url
     * @param {string} token
     */
    const getHref = async (url, token) => api(await authFetchUrl(url, token))
</script>

<Scaffold>
    <AppBar slot="app-bar">
        <LoadingText {loading} {title} />
    </AppBar>
    <div class="files">
        {#each grouped as [_, files]}
            <div class="files__group">
                <TeacherLink {...files[0]} />
                {#each files as { date, description, downloads_count, language, name, size, type, url }}
                    {#await getHref(url, $token) then href}
                        <Card {href} title={name} noroute>
                            {#if type}<p>{type}</p>{/if}
                            <div class="file__date">
                                {dtf.format(date * 1000)}
                            </div>
                            {#if description.length > 0}
                                <p class="file__description">{description}</p>
                            {/if}
                            {#if language}
                                <p>{language}</p>
                            {/if}
                            <div class="file__icon">
                                {size}
                                <Icon name="download" />
                                {#if downloads_count > 0}{downloads_count}{/if}
                            </div>
                        </Card>
                    {/await}
                {/each}
            </div>
        {:else}
            <p>{filesLoading ? _("updating") : _("no-data")}</p>
        {/each}
    </div>
    <Navigation slot="navigation-bar" />
</Scaffold>

<style>
    .files {
        display: grid;
        gap: 2em;
        max-width: 500px;
        margin: 0 auto;
    }
    .files__group {
        display: grid;
        gap: 1em;
    }
    .file__icon {
        display: flex;
        gap: 0.5em;
        align-items: center;
        justify-content: end;
    }
    .files p {
        margin: 0;
    }
</style>
