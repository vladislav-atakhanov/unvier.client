<script lang="ts">
    import { useSchedule } from "../api"
    import type { Schedule as ScheduleType } from "../@types"
    import ScheduleTabs from "../components/schedule/schedule-tabs.svelte"
    import Schedule from "../components/schedule/schedule.svelte"
    import NoteEditor from "../components/note/editor.svelte"
    import { language, i18n } from "material/i18n"
    import { notes } from "../components/note"

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

    const getLessonById = (
        schedule: ScheduleType | null,
        id: string | null,
    ) => {
        if (!schedule || !id) return null
        return schedule.lessons.find((l) => l.id === id) || null
    }

    let activeLessonId: string | null = null
    let noteEditor: NoteEditor
    const onSelect = async ({ detail: id }: { detail: string }) => {
        if (!noteEditor) return
        activeLessonId = id
        const lesson = getLessonById($schedule, id)

        const { text } = notes.getNote(id)
        const newText = await noteEditor.getText(text, lesson?.subject)
        notes.setNote(id, newText)
        activeLessonId = null
    }
</script>

<svelte:component
    this={factor !== null ? ScheduleTabs : Schedule}
    {schedule}
    {loading}
    days={DAYS}
    title={_("schedule")}
    on:select={onSelect}
    activeLesson={activeLessonId}
/>

<NoteEditor bind:this={noteEditor} />
