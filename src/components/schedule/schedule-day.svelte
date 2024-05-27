<script lang="ts">
    import type { Lesson } from "../../@types"
    import Card from "../card.svelte"
    import { i18n } from "material/i18n"
    import TeacherLink from "../teacher-link.svelte"
    import { notes, type Notes } from "../note"
    import { OneLine, LongPress } from "material/components"
    const _ = i18n()

    export let day: number
    export let lessons: Lesson[]
    export let weekday: string
    export let activeWeek: boolean | null = null
    export let onselect: (lessonId: Lesson["id"]) => void
    const isActiveDay = (day: number, activeWeek: boolean | null) => {
        const nowDay = Math.max(1, new Date().getDay())
        const _week =
            activeWeek === null ? true : nowDay > 5 ? !activeWeek : activeWeek
        return _week && day === nowDay - 1
    }

    export let activeLesson: string | null = null

    export const getNotePreview = (notes: Notes, id: string) => {
        const note = notes.getNote(id).text
        const lines = note.split("\n")
        let text = lines[0] || ""
        if (lines.length > 1) text += "..."
        return text
    }

    $: active = isActiveDay(day, activeWeek)
</script>

<div class="day" style:order={day} class:day--active={active}>
    <Card {active} title={weekday}>
        {#each lessons as { subject, time, audience, teacher, teacher_link, id } (id)}
            {@const note = getNotePreview($notes, id)}
            <LongPress
                class="long-press"
                onLongPress={() => onselect?.(id)}
                let:progress
                let:size
                let:x
                let:y
            >
                <section
                    class="lesson"
                    class:lesson--active={id === activeLesson}
                    style="transition: {id !== activeLesson
                        ? `background-color .2s`
                        : 'none'}"
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
                            <p class="lesson__note">
                                <OneLine>{note}</OneLine>
                            </p>
                        {/if}
                    </div>
                    <div
                        class="bubble"
                        style:--scale={progress}
                        style:left="{x}px"
                        style:top="{y}px"
                        style:width="{size}px"
                        style:height="{size}px"
                    ></div>
                </section>
            </LongPress>
        {:else}
            <p class="day__nolessons">{_("schedule.no-lessons")}</p>
        {/each}
    </Card>
</div>

<style>
    .day {
        --padding: 0;
        --lesson-padding: 0.5em;
        --bubble-color: color-mix(
            in srgb,
            var(--md-sys-color-primary) 15%,
            transparent
        );
    }
    .lesson__title {
        margin: 0;
        font-size: 1em;
        font-weight: normal;
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
        display: grid;
        overflow: hidden;
        position: relative;
    }
    .lesson__header {
        display: flex;
        gap: 1em;
        justify-content: space-between;
    }
    .day :global(.long-press:last-of-type .lesson) {
        padding-bottom: var(--lesson-padding);
    }
    .lesson::after {
        content: "";
        display: block;
        height: 1px;
        background-color: var(--md-sys-color-outline);
        margin-top: var(--lesson-padding);
        z-index: 1;
    }
    .day :global(.long-press:last-of-type .lesson::after) {
        display: none;
    }
    .lesson__content {
        z-index: 1;
    }
    .lesson--active {
        background-color: var(--bubble-color);
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

    .bubble {
        transition: background-color 0.2s;
        position: absolute;
        border-radius: 100%;
        transform: translate(-50%, -50%) scale(var(--scale, 0));
        background-color: var(
            --bubble-color,
            color-mix(in srgb, currentColor 10%, transparent)
        );
    }
</style>
