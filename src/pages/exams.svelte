<script>
    import { Scaffold, AppBar } from "material/components"
    import Navigation from "../components/navigation.svelte"
    import { useExams } from "../api"
    import LoadingText from "../components/loading-text.svelte"
    import Card from "../components/card.svelte"
    import { writable } from "svelte/store"
    import { onMount } from "svelte"
    import { i18n, language } from "material/i18n"
    import TeacherLink from "../components/teacher-link.svelte"
    const _ = i18n()

    const [exams, loading] = useExams()

    $: dtf = new Intl.DateTimeFormat($language, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })

    /** @param {number} timestamp */
    const getDate = (timestamp) => {
        const date = new Date(timestamp * 1000)
        return dtf.format(date)
    }

    const SECOND = 1000
    const MINUTE = 60 * SECOND
    const HOUR = 60 * MINUTE
    const DAY = 24 * HOUR

    /**
     * @param {number} timestamp
     * @param {number} now
     */
    const getDelta = (timestamp, now) => timestamp * SECOND - now

    /**
     * @param {number} timestamp
     * @param {number} now
     */
    const isActive = (timestamp, now) => {
        const delta = getDelta(timestamp, now)
        if (delta < 0) return -delta <= 5 * HOUR
        return delta <= 24 * HOUR
    }

    /**
     * @param {number} timestamp
     * @param {number} now
     */
    const isNear = (timestamp, now) => {
        const delta = getDelta(timestamp, now)
        return delta > -HOUR && delta <= HOUR * 1.5
    }
    $: rtf = new Intl.RelativeTimeFormat($language, { style: "long" })

    /**
     * @param {number} timestamp
     * @param {number} now
     */
    const relativeTime = (timestamp, now) => {
        const delta = getDelta(timestamp, now)
        if (delta <= -HOUR) return _("exams.ended")
        if (delta <= 0) return _("exams.now")

        if (delta < MINUTE)
            return rtf.format(Math.floor(delta / SECOND), "seconds")
        if (delta < HOUR)
            return rtf.format(Math.floor(delta / MINUTE), "minutes")
        if (delta < 2 * DAY)
            return rtf.format(Math.round(delta / HOUR), "hours")
        return rtf.format(Math.round(delta / DAY), "days")
    }

    let frame = 0
    const now = writable(0)
    const loop = () => {
        now.set(Math.floor(Date.now() / 1000) * 1000)
        frame = requestAnimationFrame(loop)
    }
    onMount(() => {
        frame = requestAnimationFrame(loop)
        return () => cancelAnimationFrame(frame)
    })

    /** @type {HTMLElement} */
    let element

    $: firstFeature = $exams?.reduce((prev, current) => {
        const delta = getDelta(current.date, Date.now())
        if (prev !== null) return prev
        if (delta <= -HOUR) return prev
        return current
    }, null)

    $: if (firstFeature && element) {
        const exam = document.querySelector(`[data-id="${firstFeature.date}"]`)
        exam?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        })
    }
</script>

<Scaffold>
    <AppBar slot="app-bar">
        <LoadingText {loading} title={_("exams")} />
    </AppBar>
    {#if $exams}
        <div class="exams" bind:this={element}>
            {#each $exams as { subject, teacher, audience, date, type, teacher_link } (date)}
                {@const delta = relativeTime(date, $now)}
                <Card
                    title={getDate(date)}
                    active={isActive(date, $now)}
                    data-id={date}
                >
                    <p class="exam__subject">{subject}</p>
                    <p class="exam__audience">{audience}</p>
                    <p class="exam__teacher">
                        <TeacherLink {teacher} {teacher_link} />
                    </p>
                    {#if type === "consultation"}
                        <p class="exam__delta">{_("exams.consultation")}</p>
                    {/if}
                    {#if type === "exam" && delta}
                        <p
                            class="exam__delta"
                            class:exam__delta--near={isNear(date, $now)}
                        >
                            {delta}
                        </p>
                    {/if}
                </Card>
            {/each}
        </div>
    {/if}
    <Navigation slot="navigation-bar" />
</Scaffold>

<style>
    .exam__audience {
        font-weight: bold;
    }
    .exams {
        display: grid;
        gap: 1em;
        margin: 0 auto;
        max-width: 500px;
    }
    .exam__delta {
        text-align: right;
    }
    .exam__delta--near {
        color: var(--md-sys-color-error);
    }
    .exams p {
        margin: 0;
    }
    .exams :global(.card) {
        scroll-margin-top: 1em;
    }
</style>
