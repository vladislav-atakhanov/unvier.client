<script lang="ts">
    import { Scaffold, AppBar, IconButton, Tabs } from "material/components"
    import Navigation from "../components/navigation.svelte"
    import LoadingText from "../components/loading-text.svelte"
    import { useSchedule } from "../api"
    import type { Schedule } from "../@types"
    import { EXAMS } from "../url"
    import ScheduleDay from "../components/schedule-day.svelte"
    import { onMount } from "svelte"

    const [schedule, loading] = useSchedule()
    const DAYS = [
        "Понедельник",
        "Вторник",
        "Среда",
        "Четверг",
        "Пятница",
        "Суббота",
        // "Воскресенье",
    ]
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
            title: "Числитель",
        },
        {
            value: true,
            title: "Знаменатель",
        },
    ]

    onMount(schedule.updateIfNeed)

    let tabs: Tabs

    $: tabs && tabs.select($schedule?.factor ? 1 : 0)
</script>

<div class="schedule">
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
                <LoadingText {loading} title="Расписание" />
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
        content: "(т) ";
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
