<script lang="ts">
    import { Scaffold, AppBar, IconButton } from "material/components"
    import Navigation from "../components/navigation.svelte"
    import LoadingText from "../components/loading-text.svelte"
    import { useSchedule } from "../api"
    import { onMount } from "svelte"
    import type { Schedule } from "../@types"
    import { EXAMS } from "../url"
    import ScheduleDay from "../components/schedule-day.svelte"

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

    let showNoLessons = true

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
    let weeks: HTMLElement

    const setFactor = (value: boolean, _: unknown) => {
        if (!weeks) return
        weeks.scrollTo({
            behavior: "smooth",
            left: value ? innerWidth : 0,
            top: 0,
        })
        current = value
    }
    $: setFactor(!!$schedule?.factor, weeks)

    const slide = (value: boolean) => () => {
        weeks.scrollTo({
            behavior: "smooth",
            left: value ? innerWidth : 0,
            top: 0,
        })
    }

    let header: HTMLElement
    const setLinePosition = () => {
        if (!header) return
        const line = header.querySelector(".line") as HTMLElement
        const titles = Array.from(
            header.querySelectorAll(".header__week span"),
        ) as HTMLElement[]
        const { scrollLeft, offsetWidth } = weeks

        current = weeks.scrollLeft >= innerWidth / 2

        const nearTitle = titles[+current]
        const width = nearTitle.offsetWidth

        const { left } = titles[0].getBoundingClientRect()
        const minScrollPosition = left
        const maxScrollPosition =
            titles.at(-1)?.getBoundingClientRect()?.left || 0

        console.log(maxScrollPosition)

        const translate =
            minScrollPosition +
            (scrollLeft / offsetWidth) * (maxScrollPosition - minScrollPosition)

        line.style.width = `${width}px`
        line.style.transform = `translateX(${translate}px)`
    }

    const onResize = () => {
        slide(current)
        setLinePosition()
    }
    onMount(() => {
        const local = localStorage.getItem("show-no-lessons")
        if (local) showNoLessons = JSON.parse(local)
        setTimeout(setLinePosition, 100)
        addEventListener("resize", onResize)
        return () => removeEventListener("resize", onResize)
    })
</script>

<Scaffold padding={false}>
    <AppBar slot="app-bar">
        <LoadingText {loading} title="Расписание" />
        <IconButton slot="actions" href={EXAMS} icon="playlist_add_check" />
        <div slot="bottom" class="header__weeks" bind:this={header}>
            {#each factors as { title, value }}
                <button
                    on:click={slide(value)}
                    class="header__week"
                    class:header__week--active={current === value}
                    class:header__week--current={$schedule?.factor === value}
                    ><span>{title}</span></button
                >
            {/each}
            <div class="line"></div>
        </div></AppBar
    >
    <div class="schedule">
        <div class="weeks" bind:this={weeks} on:scroll={setLinePosition}>
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
                                <ScheduleDay
                                    {weekday}
                                    {day}
                                    {lessons}
                                    activeWeek={value === $schedule?.factor}
                                />
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
    .header__weeks {
        display: flex;
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
    .header__week--current span::before {
        content: "(т) ";
        opacity: 0.5;
    }
    .header__weeks {
        position: relative;
    }
    .line {
        position: absolute;
        width: 100px;
        height: 2px;
        bottom: 5px;
        background-color: var(--md-sys-color-primary);
        opacity: 1;
        left: calc(-1 * var(--padding-inline));
    }
    @media (width >= 760px) {
        .line {
            display: none;
        }
        .weeks {
            display: grid;
            grid-template-columns: 1fr 1fr;
        }
    }
    @media (width < 760px) {
        .week {
            width: 100vw;
            flex: 100vw 0 0;
            scroll-snap-align: start;
        }
        .weeks {
            width: 100vw;
            display: flex;
            overflow: auto;
            scroll-snap-type: x mandatory;
        }
    }
    .weeks {
        scrollbar-width: none;
    }
    .weeks::-webkit-scrollbar {
        display: none;
    }

    .schedule__container {
        display: grid;
        gap: 1em;
        padding-inline: var(--container-padding-inline);
        padding-block: var(--container-padding-block);
    }
</style>
