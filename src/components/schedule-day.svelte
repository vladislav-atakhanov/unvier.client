<script lang="ts">
    import type { Lesson } from "../@types"
    import Card from "./card.svelte"
    import { i18n } from "material/i18n"
    import TeacherLink from "./teacher-link.svelte"
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
</script>

<div class="day" style:order={day}>
    <Card active={isActiveDay(day, activeWeek)} title={weekday}>
        {#each lessons as { subject, time, audience, teacher, teacher_link }}
            <section class="lesson">
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

    .day__nolessons {
        margin: 0;
    }
    .lesson {
        padding-block: var(--padding);
        border-top: 1px solid var(--md-sys-color-outline);
    }
    .lesson__header {
        display: flex;
        gap: 1em;
        justify-content: space-between;
    }
    .lesson:first-of-type {
        border: none;
        padding-top: 0;
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
