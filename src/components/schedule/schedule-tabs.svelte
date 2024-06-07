<script lang="ts">
    import { Scaffold, AppBar, Tabs } from "material/components"
    import { i18n } from "material/i18n"
    import Navigation from "../navigation.svelte"
    import LoadingText from "../loading-text.svelte"
    import type { useSchedule } from "../../api"
    import type { Schedule } from "../../@types"
    import ScheduleDay from "./schedule-day.svelte"
    import ScheduleActions from "./schedule-actions.svelte"
    import type { ComponentProps } from "svelte"

    export let schedule: ReturnType<typeof useSchedule>[0]
    export let loading: ReturnType<typeof useSchedule>[1]
    export let days: string[]
    export let title: string
    export let onselect =
        Function.prototype as ComponentProps<ScheduleDay>["onselect"]

    const _ = i18n()

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

    export let activeLesson: string | null = null
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
                <LoadingText {loading} {title} />
                <ScheduleActions slot="actions" schedule={$schedule} />
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
                            {#if $schedule !== null && $schedule.lessons.length > 0}
                                {#each days as weekday, day}
                                    {@const lessons = getLessonsByDay(
                                        $schedule,
                                        value,
                                        day,
                                    )}
                                    <ScheduleDay
                                        {weekday}
                                        {day}
                                        {lessons}
                                        {activeLesson}
                                        {onselect}
                                        activeWeek={value === $schedule?.factor}
                                    />
                                {/each}
                            {:else}
                                <p class="schedule__no-data">{_("no-data")}</p>
                            {/if}
                        </div>
                    </Content>
                {/each}
            </Wrapper>
            <Navigation slot="navigation-bar" />
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
        .schedule :global(.tab__content) {
            flex: none;
            width: auto;
        }
        .schedule :global(.tabs__content) {
            margin: 0 auto;
            max-width: 1000px;
            display: grid;
            grid-template-columns: 1fr 1fr;
        }
        .schedule :global(.tabs__line) {
            display: none;
        }
    }
</style>
