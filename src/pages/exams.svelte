<script lang="ts">
    import { useApi } from "$api"
    import AppBar from "$lib/components/app-bar.svelte"
    import Loader from "$lib/components/loader.svelte"
    import TeacherLink from "$lib/components/teacher-link.svelte"
    import Card from "$lib/components/ui/card"
    import { Separator } from "$lib/components/ui/separator"
    import { _, i18n } from "$lib/i18n"
    import Page from "$lib/layouts/page.svelte"
    import { onMount } from "svelte"


    const api = useApi()
    const query = api.fetchExams()

    let rtf = $derived(new Intl.RelativeTimeFormat(i18n.language, { style: "long" }))

    const SECOND = 1000
    const MINUTE = 60 * SECOND
    const HOUR = 60 * MINUTE
    const DAY = 24 * HOUR

    let dtf = $derived(new Intl.DateTimeFormat(i18n.language, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }))

    const getDelta = (timestamp: number, now: number) => timestamp * SECOND - now
    const getDate = (timestamp: number) => {
        const date = new Date(timestamp * 1000)
        return dtf.format(date)
    }

    const isActive = (timestamp: number, now: number) => {
        const delta = getDelta(timestamp, now)
        if (delta < 0) return -delta <= 5 * HOUR
        return delta <= 24 * HOUR
    }

    const isNear = (timestamp: number, now: number) => {
        const delta = getDelta(timestamp, now)
        return delta > -HOUR && delta <= HOUR * 1.5
    }

    const relativeTime = (timestamp: number, now: number) => {
        const delta = getDelta(timestamp, now)
        if (delta <= -HOUR) return _("exams.ended")
        if (delta <= 0) return _("exams.now")

        if (delta < MINUTE)
            return rtf.format(Math.floor(delta / SECOND), "seconds")
        if (delta < HOUR)
            return rtf.format(Math.floor(delta / MINUTE), "minutes")
        if (delta < 2 * DAY)
            return rtf.format(Math.round(delta / HOUR), "hours")
        return rtf.format(Math.round(delta / DAY), "days")
    }

    let now = $state(Date.now())

    onMount(() => {
        const loop = () => {
            now = Date.now()
            setTimeout(() => {
                frame = requestAnimationFrame(loop)
            }, 1000)
        }
        let frame = requestAnimationFrame(loop)
        return () => cancelAnimationFrame(frame)
    })
</script>

<Page>
    {#snippet header()}
        <AppBar>
            {#snippet title()}
                {#if query.state === "ready"}
                    {_("exams")}
                {:else if query.state === "update"}
                    {_("updating")}
                {:else if query.state === "load"}
                    {_("loading")}
                {/if}
            {/snippet}
        </AppBar>
    {/snippet}
    <div class="grid mx-auto p-2 gap-2 max-w-md">
        {#if query.data}
            {#each query.data as {audience, date, subject, teacher, type, teacher_link}}
                {@const delta = relativeTime(date, now)}
                <Card title={getDate(date)} active={isActive(date, now)}>
                    <p>{subject}</p>
                    <p class="font-bold">{audience}</p>
                    <p><TeacherLink {teacher} {teacher_link} /> </p>
                    {#if type === "consultation"}
                        <p class="text-right">{_("exams.consultation")}</p>
                    {/if}
                    {#if type === "exam" && delta}
                        <p
                            class="text-right"
                            class:text-destructive={isNear(date, now)}
                        >
                            {delta}
                        </p>
                    {/if}
                </Card>
            {:else}
            {_("no-data")}
            {/each}
        {:else}
            <Loader />
        {/if}

    </div>
</Page>

