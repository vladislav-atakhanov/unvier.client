<script>
    import { Scaffold, AppBar } from "material/components"
    import Navigation from "../components/navigation.svelte"
    import { useExams } from "../api"
    import LoadingText from "../components/loading-text.svelte"

    const [exams, loading] = useExams()

    /** @param {number} timestamp */
    const getDate = (timestamp) => {
        const date = new Date(timestamp * 1000)
        const intl = new Intl.DateTimeFormat("ru", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
        return intl.format(date)
    }

    const HOUR = 60 * 60 * 1000

    /** @param {number} timestamp */
    const isActive = (timestamp) => {
        const now = Date.now()
        const delta = timestamp * 1000 - now
        if (delta < 0) {
            return -delta <= 5 * HOUR
        }
        return delta <= 24 * HOUR
    }
</script>

<Scaffold padding={false}>
    <AppBar slot="app-bar">
        <LoadingText {loading} title="Экзамены" />
    </AppBar>
    {#if $exams}
        {#each $exams as { subject, teacher, audience, date }}
            <section class="exam" class:exam--active={isActive(date)}>
                <time class="exam__date">{getDate(date)}</time>
                <p class="exam__subject">{subject}</p>
                <p class="exam__audience">{audience}</p>
                <p class="exam__teacher">{teacher}</p>
            </section>
        {/each}
    {/if}
    <Navigation slot="navigation-bar" />
</Scaffold>

<style>
    .exam {
        border-top: 1px solid var(--md-sys-color-outline);
        padding-block: var(--padding-block, 1em);
        padding-inline: var(--container-padding-inline);
        padding-block: var(--container-padding-block);
    }
    .exam__date,
    .exam__audience {
        font-weight: bold;
    }
    .exam p {
        margin: 0;
    }
    .exam--active {
        background-color: var(--md-sys-color-secondary-container);
    }
</style>
