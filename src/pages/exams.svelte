<script>
    import { Scaffold, AppBar } from "material/components"
    import Navigation from "../components/navigation.svelte"
    import { useExams } from "../api"
    import LoadingText from "../components/loading-text.svelte"
    import Card from "../components/card.svelte"

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

<Scaffold>
    <AppBar slot="app-bar">
        <LoadingText {loading} title="Экзамены" />
    </AppBar>
    {#if $exams}
        <div class="exams">
            {#each $exams as { subject, teacher, audience, date }}
                <Card title={getDate(date)}>
                    <p class="exam__subject">{subject}</p>
                    <p class="exam__audience">{audience}</p>
                    <p class="exam__teacher">{teacher}</p>
                </Card>
                <!-- <section class="exam" class:exam--active={isActive(date)}>
                <time class="exam__date">{getDate(date)}</time>
            </section> -->
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
    }
    .exams p {
        margin: 0;
    }
</style>
