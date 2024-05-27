<script lang="ts">
    import { Scaffold, AppBar, Tabs } from "material/components"
    import Navigation from "../navigation.svelte"
    import LoadingText from "../loading-text.svelte"
    import type { useSchedule } from "../../api"
    import type { Schedule } from "../../@types"
    import ScheduleDay from "./schedule-day.svelte"
    import { i18n } from "material/i18n"
    import ScheduleActions from "./schedule-actions.svelte"
    import type { ComponentProps } from "svelte"

    export let schedule: ReturnType<typeof useSchedule>[0]
    export let loading: ReturnType<typeof useSchedule>[1]
    export let days: string[]
    export let title: string

    export let onselect =
        Function.prototype as ComponentProps<ScheduleDay>["onselect"]

    const getLessonsByDay = (schedule: Schedule | null, _day: number) => {
        if (!schedule || schedule.lessons.length < 1) return []
        return schedule.lessons.filter(({ day }) => day === _day)
    }

    let tabs: Tabs

    $: tabs && tabs.select($schedule?.factor ? 1 : 0)

    const _ = i18n()
    export let activeLesson: string | null = null
</script>

<Scaffold padding={false}>
    <AppBar slot="app-bar">
        <LoadingText {loading} {title} />
        <ScheduleActions slot="actions" schedule={$schedule} />
    </AppBar>
    <div class="schedule__container container">
        {#if $schedule !== null && $schedule.lessons.length > 0}
            {#each days as weekday, day}
                {@const lessons = getLessonsByDay($schedule, day)}
                <ScheduleDay
                    {weekday}
                    {day}
                    {lessons}
                    {onselect}
                    {activeLesson}
                />
            {/each}
        {:else}
            <p class="schedule__no-data">{_("no-data")}</p>
        {/if}
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
