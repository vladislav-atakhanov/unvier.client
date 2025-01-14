<script lang="ts">
    import { useApi, subject, type Lesson, type Schedule, teacher } from "$api"
    import AppBar from "$lib/components/app-bar.svelte"
    import TeacherLink from "$lib/components/teacher-link.svelte"
    import Button from "$lib/components/ui/button/button.svelte"
    import * as Hold from "$lib/components/ui/hold"
    import { Card } from "$lib/components/ui/card"
    import Separator from "$lib/components/ui/separator/separator.svelte"
    import { _, i18n } from "$lib/i18n"
    import Page from "$lib/layouts/page.svelte"
    import { useRouter } from "$lib/router"
    import { nullish, randInt } from "$lib/utils"
    import { onMount, tick, type ComponentProps, type Snippet } from "svelte"
    import Note from "$lib/components/note.svelte"
    import { Skeleton } from "$lib/components/ui/skeleton"

    const router = useRouter()
    const api = useApi()
    const query = api.fetchSchedule()

    let dtf = $derived(
        new Intl.DateTimeFormat(i18n.language, { weekday: "long" }),
    )
    const capitalize = (text: string) =>
        text[0].toUpperCase() + text.substring(1)

    let DAYS = $derived(
        Array(7)
            .fill(1)
            .map((_, index) => dtf.format(new Date(Date.UTC(2021, 5, index))))
            .map(capitalize),
    )

    const getLessonsByDay = (
        schedule: Schedule | undefined,
        _factor: boolean | null,
        _day: number,
    ) => {
        if (!schedule || schedule.lessons.length < 1) return []

        if (!schedule || schedule.lessons.length < 1) return []
        if (nullish(_factor))
            return schedule.lessons.filter(({ day }) => day === _day)
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
            block: "start",
        })
    }

    const updateIndicatorPosition = (x: number, min: number, max: number) => {
        if (x < min || x > max) return
        const percent = (x - min) / (max - min)
        indicator.style.transform = `translateX(${percent * 100}%)`
    }
    const updateHeaderPosition = (x: number, min: number, max: number) => {
        if (x < min)
            return (header.style.transform = `translateX(${min - x}px)`)
        if (x > max)
            return (header.style.transform = `translateX(${max - x}px)`)
        header.style.transform = "none"
    }

    let isSingle = $derived(query.data?.factor === null)
    $effect(() => {
        if (isSingle) return
        onMount(() =>
            router.addOnScroll(({ x }) => {
                if (!indicator) return [0, 0]
                const positions = factors
                    .map(
                        ({ value }) =>
                            document.getElementById(`factor-${value}`)
                                ?.offsetLeft,
                    )
                    .filter((x) => !nullish(x))
                if (positions.length < 1) return [0, 0]
                const min = Math.min(...positions)
                const max = Math.max(...positions)

                updateIndicatorPosition(x, min, max)
                updateHeaderPosition(x, min, max)
            }),
        )
    })
    $effect(() => {
        if (!isSingle && query.data) {
            tick().then(scrollTo(`factor-${query.data.factor}`))
        }
    })

    let indicator: HTMLElement
    let header: HTMLElement
    let headerHeight = $state(0)

    let selectedLesson = $state<string>()
    const openNote = async ({ id, subject }: Lesson) => {
        selectedLesson = id
        const text = await note.open(api.notes[id]?.text ?? "", subject)
        api.setNote(id, text)
        selectedLesson = undefined
    }

    let note: Note

    const getNotePreview = (id: string) => {
        const note = api.notes[id]?.text ?? ""
        const lines = note.split("\n")
        let text = lines[0] || ""
        if (lines.length > 1) text += "..."
        return text
    }
</script>

{#snippet title()}
    {#if query.state === "update"}
        {_("updating")}
    {:else}
        {_("schedule")}
    {/if}
{/snippet}
{#snippet right()}
    <Button variant="ghost" size="icon" class="pointer-events-none"
        >{query.data?.week}</Button
    >
{/snippet}

{#snippet separator()}
    <div class="px-2"><Separator /></div>
{/snippet}

{#snippet week({
    getLessons,
    active,
    header,
    ...props
}: {
    getLessons: (day: number) => Lesson[]
    active: (day: number) => boolean
    header?: Snippet
} & ComponentProps<typeof Page>)}
    <Page {header} {...props}>
        <div
            class="mx-auto p-2 max-w-md space-y-2"
            style:padding-top="calc(.5rem + {headerHeight}px)"
        >
            {#each DAYS as weekday, day}
                {@const lessons = getLessons(day)}
                {@const isActive = active(day)}
                <Card active={isActive} class="p-0" {separator}>
                    {#snippet title()}
                        <span class="p-2 inline-block">{weekday}</span>
                    {/snippet}

                    {#each lessons as lesson, index (lesson.id)}
                        {@const {
                            subject,
                            time,
                            audience,
                            teacher,
                            teacher_link,
                            id,
                        } = lesson}
                        {@const note = getNotePreview(id)}
                        <Hold.Root
                            tag="section"
                            class="p-2 {id === selectedLesson
                                ? 'bg-primary bg-opacity-10'
                                : ''}"
                            onhold={() => openNote(lesson)}
                        >
                            <div class="flex justify-between gap-4">
                                <h3>{subject}</h3>
                                <p class="whitespace-nowrap">{time}</p>
                            </div>
                            <p class="font-bold">{audience}</p>
                            <p><TeacherLink {teacher} {teacher_link} /></p>
                            {#if note.length > 0}
                                <p class="opacity-60">{note}</p>
                            {/if}
                            <Hold.Bubble
                                class={isActive ? "text-primary" : ""}
                            />
                        </Hold.Root>
                        {#if index !== lessons.length - 1}
                            {@render separator()}
                        {/if}
                    {:else}
                        <p class="p-2">{_("schedule.no-lessons")}</p>
                    {/each}
                </Card>
            {/each}
        </div>
    </Page>
{/snippet}

{#if nullish(query.data)}
    <Page>
        {#snippet header()}
            <AppBar title={_("schedule")} />
        {/snippet}
        <div class="mx-auto p-2 max-w-md space-y-2">
            {#each DAYS as weekday}
                {@const lessons = randInt(2, 4)}
                <Card class="p-0" {separator}>
                    {#snippet title()}
                        <span class="p-2 inline-block">{weekday}</span>
                    {/snippet}

                    {#each { length: lessons } as _, index}
                        <section class="p-2">
                            <div class="grid grid-cols-[1fr_max-content] gap-4">
                                <h3><Skeleton symbols={subject()} /></h3>
                                <p class="whitespace-nowrap">
                                    <Skeleton symbols={10} />
                                </p>
                            </div>
                            <p class="font-bold"><Skeleton symbols={5} /></p>
                            <p>
                                <Skeleton
                                    symbols={teacher()}
                                    class="bg-primary"
                                />
                            </p>
                        </section>
                        {#if index !== lessons}
                            {@render separator()}
                        {/if}
                    {:else}
                        <p class="p-2">{_("schedule.no-lessons")}</p>
                    {/each}
                </Card>
            {/each}
        </div>
    </Page>
{:else if isSingle}
    {#snippet header()}
        <AppBar {title} {right} />
    {/snippet}
    {@render week({
        getLessons: (day) => getLessonsByDay(query?.data, null, day),
        active: (day) => isActiveDay(day, true),
        header,
    })}
{:else}
    <div
        class="fixed top-0 left-0 w-full z-10"
        bind:clientHeight={headerHeight}
        bind:this={header}
    >
        <AppBar {title} {right}>
            {#snippet bottom()}
                <div class="flex relative mt-2 mx-auto max-w-sm">
                    {#each factors as { title, value }}
                        <button
                            class="flex-1 z-10"
                            onclick={scrollTo(`factor-${value}`)}
                        >
                            {#if value === query.data?.factor}
                                <span class="opacity-50"
                                    >{_("schedule.current")}</span
                                >
                            {/if}
                            {title}
                        </button>
                    {/each}
                    <div
                        class="bg-muted rounded absolute -top-1 -bottom-1"
                        bind:this={indicator}
                        style:width="{100 / factors.length}%"
                    ></div>
                </div>
            {/snippet}
        </AppBar>
    </div>
    {#each factors as { value }}
        {@render week({
            getLessons: (day) => getLessonsByDay(query?.data, value, day),
            active: (day) => isActiveDay(day, value === query.data?.factor),
            id: `factor-${value}`,
            "data-page": "schedule",
        })}
    {/each}
{/if}
<Note bind:this={note} />
