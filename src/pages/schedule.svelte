<script>
    import { Scaffold, AppBar } from "material/components"
    import Navigation from "../components/navigation.svelte"
    import LoadingText from "../components/loading-text.svelte"
    import { useSchedule } from "../api"
    import { onMount } from "svelte"

    const [schedule, loading] = useSchedule()
    const DAYS = [
        "Понедельник",
        "Вторник",
        "Среда",
        "Четверг",
        "Пятница",
        "Суббота",
        // "Воскресенье",
    ]
    /**
     *
     * @param {import("../@types").Schedule | null} schedule
     * @param {boolean} _factor
     * @param {number} _day
     */
    const getLessonsByDay = (schedule, _factor, _day) => {
        if (!schedule || schedule.lessons.length < 1) return []
        return schedule.lessons.filter(
            ({ factor, day }) => factor === _factor && day === _day,
        )
    }

    let showNoLessons = true
    onMount(() => {
        const local = localStorage.getItem("show-no-lessons")
        if (local) showNoLessons = JSON.parse(local)
    })

    const factors = [
        {
            value: false,
            title: "Числитель",
        },
        {
            value: true,
            title: "Знаменатель",
        },
    ]
    let current = false
    /** @type {HTMLElement} */
    let weeks

    /**
     * @param {boolean} value
     * @param {unknown} _
     */
    const setFactor = (value, _) => {
        if (!weeks) return
        weeks.scrollTo({
            behavior: "smooth",
            left: value ? innerWidth : 0,
            top: 0,
        })
        current = value
    }
    $: setFactor(!!$schedule?.factor, weeks)

    /** @param {boolean} value */
    const slide = (value) => () => {
        weeks.scrollTo({
            behavior: "smooth",
            left: value ? innerWidth : 0,
            top: 0,
        })
        current = value
    }

    const onScroll = () => {
        current = weeks.scrollLeft >= innerWidth - 100
    }
</script>

<Scaffold padding={false}>
    <AppBar slot="app-bar">
        <LoadingText {loading} title="Расписание" />
        <div slot="bottom" class="header__weeks">
            {#each factors as { title, value }}
                <button
                    on:click={slide(value)}
                    class="header__week"
                    class:header__week--active={current === value}
                    class:header__week--current={$schedule?.factor === value}
                >
                    <span class="week__title">{title}</span>
                </button>
            {/each}
            <div></div>
        </div></AppBar
    >
    <div class="schedule">
        <div class="weeks" bind:this={weeks} on:scrollend={onScroll}>
            {#each factors as { value }}
                <div class="week">
                    <div class="schedule__container container">
                        {#each DAYS as weekday, day}
                            {@const lessons = getLessonsByDay(
                                $schedule,
                                value,
                                day,
                            )}
                            {#if lessons.length > 0 || showNoLessons}
                                <section class="day" style:order={day}>
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
                                        <p class="nolessons">Занятий нет 🎉</p>
                                    {/each}
                                </section>
                            {/if}
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
    </div>
    <Navigation slot="navigation-bar" />
</Scaffold>

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
    .header__weeks {
        display: flex;
    }
    .nolessons {
        border-top: 1px solid var(--md-sys-color-outline);
        padding-top: var(--padding);
        margin: 0;
    }
    .header__week {
        margin: 0;
        flex: 1 0 0;
        padding: 0;
        color: inherit;
        background-color: transparent;
        display: block;
        width: 100%;
        border: none;
        padding-bottom: 8px;
    }
    .header__week span {
        position: relative;
    }
    .header__week--current span::before {
        content: "(т) ";
        opacity: 0.5;
    }
    .header__week span::after {
        content: "";
        position: absolute;
        width: 100%;
        height: 2px;
        top: calc(100% + 2px);
        background-color: var(--pallete-primary-40);
        opacity: 0;
        left: 0;
    }
    .header__week--active span::after {
        opacity: 1;
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
    .weeks {
        display: flex;
        width: 100vw;
        overflow: auto;
        scroll-snap-type: x mandatory;
        scrollbar-width: none;
    }
    .weeks::-webkit-scrollbar {
        display: none;
    }

    .week {
        width: 100vw;
        flex: 100vw 0 0;
        scroll-snap-align: start;
    }
    .schedule__container {
        display: grid;
        gap: 1em;
        padding: var(--container-padding);
    }
</style>
