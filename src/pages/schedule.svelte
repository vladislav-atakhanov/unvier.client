<script lang="ts">
    import { useApi, type Lesson, type Schedule } from "$api"
    import AppBar from "$lib/components/app-bar.svelte"
    import Loader from "$lib/components/loader.svelte"
    import TeacherLink from "$lib/components/teacher-link.svelte"
    import Button from "$lib/components/ui/button/button.svelte"
    import { Card } from "$lib/components/ui/card"
    import Separator from "$lib/components/ui/separator/separator.svelte"


    import { _, i18n } from "$lib/i18n"
    import Page from "$lib/layouts/page.svelte"
    import { useRouter } from "$lib/router"
    import { nullish } from "$lib/utils"
    import { onMount } from "svelte"

    const router = useRouter()
    const api = useApi()
    const query = api.fetchSchedule()

    let dtf = $derived(new Intl.DateTimeFormat(i18n.language, { weekday: "long" }))
    const capitalize = (text: string) =>
        text[0].toUpperCase() + text.substring(1)

    let DAYS = $derived(Array(7)
        .fill(1)
        .map((_, index) => dtf.format(new Date(Date.UTC(2021, 5, index))))
        .map(capitalize))

    const getLessonsByDay = (
        schedule: Schedule | undefined,
        _factor: boolean | null,
        _day: number,
    ) => {
        if (!schedule || schedule.lessons.length < 1) return []

        if (!schedule || schedule.lessons.length < 1) return []
        if (nullish(_factor)) return schedule.lessons.filter(({ day }) => day === _day)
        return schedule.lessons.filter(
            ({ factor, day }) => factor === _factor && day === _day,
        )
    }

    const isActiveDay = (day: number, activeWeek: boolean | null) => {
        const nowDay = Math.max(1, new Date().getDay())
        const _week =
            activeWeek === null ? true : nowDay > 5 ? !activeWeek : activeWeek
        return _week && day === nowDay - 1
    }

    const factors = $derived([
        {
            value: false,
            title: _("schedule.odd"),
        },
        {
            value: true,
            title: _("schedule.even"),
        },
    ])

    const scrollTo = (factor: string) => () => {
        const week = document.getElementById(factor)
        week?.scrollIntoView({
            behavior: "smooth",
            inline: "start",
            block: "start"
        })
    }
    let isSingle = $derived(query.data?.factor === null)
    $effect(() => {
        if (isSingle) return
        onMount(() => router.addOnScroll(({x}) => {
            if (!indicator) return
            const positions = factors.map(({value}) => document.getElementById(`factor-${value}`)?.offsetLeft).filter(x => !nullish(x))
            if (positions.length < 1) return
            const min = Math.min(...positions)
            const max = Math.max(...positions)
            if (x < min || x > max) return
            const percent = (x - min) / (max - min)
            indicator.style.transform = `translateX(${percent * 100}%)`
            const header = document.querySelector(".schedule__header")
            if (!header) return
            (header as HTMLElement).style.transform = `translateX(${percent * 100}%)`
        }))
    })

    let indicator: HTMLElement

</script>

{#snippet title()}
    {#if query.state === "update"}
        {_("updating")}
    {:else}
        {_("schedule")}
    {/if}
{/snippet}
{#snippet right()}
    <p>{query.data?.week}</p>
{/snippet}

{#snippet week(getLessons: (day: number) => Lesson[], active: (day: number) => boolean, id?: string)}
    <div class="space-y-4 p-4 week" {id}>
        {#each DAYS as weekday, day}
            {@const lessons = getLessons(day)}
            <Card title={weekday} active={active(day)}>
                {#each lessons as { subject, time, audience, teacher, teacher_link, id }, index (id)}
                    <section class="lesson">
                        <div class="flex content-between gap-4">
                            <h3>{subject}</h3>
                            <p class="whitespace-nowrap">{time}</p>
                        </div>
                        <p class="font-bold">{audience}</p>
                        <p><TeacherLink {teacher} {teacher_link} /></p>
                    </section>
                    {#if index !== lessons.length - 1}
                        <Separator class="my-2" />
                    {/if}
                {:else}
                    <p>{_("schedule.no-lessons")}</p>
                {/each}
            </Card>
        {/each}
    </div>
{/snippet}

{#if isSingle}
    <Page>
        {#snippet header()}
            <AppBar {title} {right} />
        {/snippet}
        {#if query.state === "load"}
            <Loader class="p-4" />
        {:else if !nullish(query.data)}
            {#if query.data.lessons.length === 0}
                <p class="p-4">{_("no-data")}</p>
            {:else}
                {@render week(
                    (day) => getLessonsByDay(
                        query?.data,
                        null,
                        day,
                    ),
                    (day) => isActiveDay(day, true)
                )}
            {/if}
        {/if}
    </Page>
{:else}
    <Page class="basis-[200vw]" headerClass="schedule__header">
        {#snippet header()}
            <AppBar {title} {right}>
                {#snippet bottom()}
                    <div class="flex relative mt-2">
                        <div bind:this={indicator} style:width="{100 / factors.length}%" class="bg-primary rounded absolute -top-1 -bottom-1 opacity-15"></div>
                        {#each factors as {title, value}}
                            <button class="flex-1 z-10" onclick={scrollTo(`factor-${value}`)}>
                                {#if value === query.data?.factor}
                                    <span class="opacity-50">{_("schedule.current")}</span>
                                {/if}
                                {title}
                            </button>
                        {/each}
                    </div>
                {/snippet}
            </AppBar>
        {/snippet}
        {#if query.state === "load"}
            <Loader class="p-4" />
        {:else if !nullish(query.data)}
            {#if query.data.lessons.length === 0}
                <p class="p-4">{_("no-data")}</p>
            {:else}
                <div class="grid mx-auto justify-center items-start grid-cols-2">
                    {#each factors as {value}}
                        {@render week(
                            (day) => getLessonsByDay(
                                query?.data,
                                value,
                                day,
                            ),
                            (day) => isActiveDay(day, value === query.data?.factor),
                            `factor-${value}`
                        )}
                    {/each}
                </div>
            {/if}
        {/if}
    </Page>
{/if}

<style>
    .week {
        scroll-snap-align: start;
        scroll-snap-stop: always;
    }
</style>