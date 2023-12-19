<script lang="ts">
    import { Scaffold, AppBar, IconButton, Tabs } from "material/components"
    import { i18n, language } from "material/i18n"
    import Navigation from "../components/navigation.svelte"
    import LoadingText from "../components/loading-text.svelte"
    import { useSchedule } from "../api"
    import type { Schedule } from "../@types"
    import { EXAMS } from "../url"
    import ScheduleDay from "../components/schedule-day.svelte"

    const [schedule, loading] = useSchedule()
    const _ = i18n()

    const capitalize = (text: string) =>
        text[0].toUpperCase() + text.substring(1)

    $: dtf = new Intl.DateTimeFormat($language, { weekday: "long" })
    $: DAYS = Array(7)
        .fill(1)
        .map((_, index) => dtf.format(new Date(Date.UTC(2021, 5, index))))
        .map(capitalize)
    const getLessonsByDay = (
        schedule: Schedule | null,
        _factor: boolean,
        _day: number,
    ) => {
        if (!schedule || schedule.lessons.length < 1) return []
        return schedule.lessons.filter(
            ({ factor, day }) => factor === _factor && day === _day,
        )
    }

    const factors = [
        {
            value: false,
            title: _("schedule.odd"), // !!TODO
        },
        {
            value: true,
            title: _("schedule.even"),
        },
    ]

    let tabs: Tabs

    $: tabs && tabs.select($schedule?.factor ? 1 : 0)
</script>

<div class="schedule" style:--current-content={`"${_("schedule.current")}"`}>
    <Tabs
        let:Content
        let:Wrapper
        let:Header
        let:Tab
        bind:this={tabs}
        maxWidth={760}
    >
        <Scaffold padding={false}>
            <AppBar slot="app-bar">
                <LoadingText {loading} title={_("schedule")} />
                <IconButton
                    slot="actions"
                    href={EXAMS}
                    icon="playlist_add_check"
                />
                <Header slot="bottom">
                    {#each factors as { title, value }}
                        <Tab
                            ><span class:current={value === $schedule?.factor}
                                >{title}</span
                            ></Tab
                        >
                    {/each}
                </Header>
            </AppBar>
            <Wrapper>
                {#each factors as { value }}
                    <Content>
                        <div class="schedule__container container">
                            {#each DAYS as weekday, day}
                                {@const lessons = getLessonsByDay(
                                    $schedule,
                                    value,
                                    day,
                                )}
                                <ScheduleDay
                                    {weekday}
                                    {day}
                                    {lessons}
                                    activeWeek={value === $schedule?.factor}
                                />
                            {/each}
                        </div>
                    </Content>
                {/each}
            </Wrapper>
            <Navigation on:update={schedule.update} slot="navigation-bar" />
        </Scaffold>
    </Tabs>
</div>

<style>
    span.current::before {
        content: var(--current-content, "(т) ");
        opacity: 0.5;
    }
    .schedule__container {
        display: grid;
        gap: 1em;
        padding-inline: var(--container-padding-inline);
        padding-block: var(--container-padding-block);
        max-width: 500px;
        margin: 0 auto;
    }
    @media (width >= 760px) {
        .schedule :global(.tabs__header) {
            margin: 0 auto;
            max-width: 1000px;
        }
        .schedule :global(.tabs__wrapper) {
            display: grid;
            grid-template-columns: 1fr 1fr;
            margin: 0 auto;
            max-width: 1000px;
        }
        .schedule :global(.tabs__content) {
            width: auto;
        }
        .schedule :global(.tabs__line) {
            display: none;
        }
    }
</style>
