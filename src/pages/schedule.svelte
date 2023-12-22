<script lang="ts">
    import { useSchedule } from "../api"
    import ScheduleTabs from "../components/schedule-tabs.svelte"
    import Schedule from "../components/schedule.svelte"
    import { language, i18n } from "material/i18n"

    const _ = i18n()
    const [schedule, loading] = useSchedule()

    $: factor = $schedule?.factor

    const capitalize = (text: string) =>
        text[0].toUpperCase() + text.substring(1)

    $: dtf = new Intl.DateTimeFormat($language, { weekday: "long" })
    $: DAYS = Array(7)
        .fill(1)
        .map((_, index) => dtf.format(new Date(Date.UTC(2021, 5, index))))
        .map(capitalize)
</script>

<svelte:component
    this={factor ? ScheduleTabs : Schedule}
    {schedule}
    {loading}
    days={DAYS}
    title={_("schedule")}
/>
