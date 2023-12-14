<script lang="ts">
    import type { Lesson } from "../@types"

    export let day: number
    export let lessons: Lesson[]
    export let weekday: string
    export let activeWeek = false

    const isToday = (day: number) => {
        const now = new Date()
        return day === now.getDay()
    }
</script>

<section
    class="day"
    style:order={day}
    class:day--active={activeWeek && isToday(day)}
>
    <h2 class="day__title">{weekday}</h2>
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
</section>

<style>
    .day__title,
    .lesson__title {
        margin: 0;
        font-size: 1em;
        font-weight: normal;
    }
    .day__title {
        padding-bottom: var(--padding);
    }
    .day {
        --padding: 0.5em;
        padding: var(--padding);
        border: 1px solid var(--md-sys-color-outline);
        border-radius: 5px;
    }
    .day--active {
        border: 1px solid var(--md-sys-color-primary);
    }
    .day__nolessons {
        border-top: 1px solid var(--md-sys-color-outline);
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
