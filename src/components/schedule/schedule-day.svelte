<script lang="ts">
    import type { Lesson } from "../../@types"
    import Card from "../card.svelte"
    import { i18n } from "material/i18n"
    import TeacherLink from "../teacher-link.svelte"
    import { longPress } from "material/actions"
    import { createEventDispatcher } from "svelte"
    import { notes, type Notes } from "../note"
    import { OneLine } from "material/components"
    const _ = i18n()

    export let day: number
    export let lessons: Lesson[]
    export let weekday: string
    export let activeWeek: boolean | null = null
    const isActiveDay = (day: number, activeWeek: boolean | null) => {
        const nowDay = Math.max(1, new Date().getDay())
        const _week =
            activeWeek === null ? true : nowDay > 5 ? !activeWeek : activeWeek
        return _week && day === nowDay - 1
    }

    const dispatch = createEventDispatcher()
    const onLongPress = (id: Lesson["id"]) => () => dispatch("select", id)

    export let activeLesson: string | null = null

    export const getNotePreview = (notes: Notes, id: string) => {
        const note = notes.getNote(id).text
        const lines = note.split("\n")
        let text = lines[0] || ""
        if (lines.length > 1) text += "..."
        return text
    }
</script>

<div class="day" style:order={day}>
    <Card active={isActiveDay(day, activeWeek)} title={weekday}>
        {#each lessons as { subject, time, audience, teacher, teacher_link, id } (id)}
            {@const note = getNotePreview($notes, id)}
            <section
                class="lesson"
                class:lesson--active={id === activeLesson}
                use:longPress={onLongPress(id)}
            >
                <div class="lesson__content">
                    <div class="lesson__header">
                        <h3 class="lesson__title">
                            {subject}
                        </h3>
                        <p class="lesson__time">{time}</p>
                    </div>
                    <p class="lesson__audience">
                        {audience}
                    </p>
                    <p class="lesson__teacher">
                        <TeacherLink {teacher} {teacher_link} />
                    </p>
                    {#if note.length > 0}
                        <p class="lesson__note"><OneLine>{note}</OneLine></p>
                    {/if}
                </div>
            </section>
        {:else}
            <p class="day__nolessons">{_("schedule.no-lessons")}</p>
        {/each}
    </Card>
</div>

<style>
    .lesson__title {
        margin: 0;
        font-size: 1em;
        font-weight: normal;
    }
    .day {
        --padding: 0;
        --lesson-padding: 0.5em;
    }
    .day :global(.card--slot .card__title) {
        padding: var(--lesson-padding);
        padding-bottom: 0;
    }
    .day :global(.card--slot .card__title::after) {
        margin-top: var(--lesson-padding);
    }
    .lesson__note {
        margin: 0;
        color: var(--md-sys-color-outline);
    }
    .day__nolessons {
        margin: 0;
        padding: var(--lesson-padding);
    }
    .lesson {
        padding: var(--lesson-padding);
        padding-bottom: 0;
    }
    .lesson__header {
        display: flex;
        gap: 1em;
        justify-content: space-between;
    }
    .lesson:last-of-type {
        padding-bottom: var(--lesson-padding);
    }
    .lesson::after {
        content: "";
        display: block;
        height: 1px;
        background-color: var(--md-sys-color-outline);
        margin-top: var(--lesson-padding);
    }
    .lesson:last-of-type::after {
        display: none;
    }
    .lesson--active {
        background-color: var(--md-sys-color-secondary-container);
    }
    .lesson__time {
        white-space: nowrap;
    }
    .lesson__teacher {
        display: block;
    }
    .lesson__audience {
        font-weight: bold;
    }
    .lesson p {
        margin: 0;
    }
</style>
