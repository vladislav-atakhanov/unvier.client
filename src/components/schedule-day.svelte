<script lang="ts">
    import type { Lesson } from "../@types"
    import Card from "./card.svelte"

    export let day: number
    export let lessons: Lesson[]
    export let weekday: string
    export let activeWeek = false
    const isActiveDay = (day: number, activeWeek: boolean) => {
        const nowDay = Math.max(1, new Date().getDay())
        const _week = nowDay > 5 ? !activeWeek : activeWeek
        return _week && day === nowDay - 1
    }
</script>

<div class="day" style:order={day}>
    <Card active={isActiveDay(day, activeWeek)} title={weekday}>
        {#each lessons as { subject, time, audience, teacher }}
            <section class="lesson">
                <div class="lesson__content">
                    <h3 class="lesson__title">
                        {subject}
                    </h3>
                    <p class="lesson__audience">
                        {audience}
                    </p>
                    <p class="lesson__teacher">
                        {teacher}
                    </p>
                </div>
                <p class="lesson__time">{time}</p>
            </section>
        {:else}
            <p class="day__nolessons">Занятий нет 🎉</p>
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
        padding-top: var(--padding);
        margin: 0;
    }
    .lesson {
        padding-block: var(--padding);
        border-top: 1px solid var(--md-sys-color-outline);
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
    .lesson__audience {
        font-weight: bold;
    }
    .lesson p {
        margin: 0;
    }
</style>
