<script lang="ts">
    import { Scaffold, AppBar, IconButton, Tabs } from "material/components"
    import Navigation from "../components/navigation.svelte"
    import LoadingText from "../components/loading-text.svelte"
    import type { useSchedule } from "../api"
    import type { Schedule } from "../@types"
    import { EXAMS } from "../url"
    import ScheduleDay from "../components/schedule-day.svelte"

    export let schedule: ReturnType<typeof useSchedule>[0]
    export let loading: ReturnType<typeof useSchedule>[1]
    export let days: string[]
    export let title: string

    const getLessonsByDay = (schedule: Schedule | null, _day: number) => {
        if (!schedule || schedule.lessons.length < 1) return []
        return schedule.lessons.filter(({ day }) => day === _day)
    }

    let tabs: Tabs

    $: tabs && tabs.select($schedule?.factor ? 1 : 0)
</script>

<Scaffold padding={false}>
    <AppBar slot="app-bar">
        <LoadingText {loading} {title} />
        <IconButton slot="actions" href={EXAMS} icon="playlist_add_check" />
    </AppBar>
    <div class="schedule__container container">
        {#each days as weekday, day}
            {@const lessons = getLessonsByDay($schedule, day)}
            <ScheduleDay {weekday} {day} {lessons} />
        {/each}
    </div>
    <Navigation slot="navigation-bar" />
</Scaffold>

<style>
    .schedule__container {
        display: grid;
        gap: 1em;
        padding-inline: var(--container-padding-inline);
        padding-block: var(--container-padding-block);
        max-width: 500px;
        margin: 0 auto;
    }
</style>
