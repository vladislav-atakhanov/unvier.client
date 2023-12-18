<script lang="ts">
    import { Scaffold, AppBar, Tabs } from "material/components"
    import Navigation from "../components/navigation.svelte"
    import { useAttestation } from "../api"
    import LoadingText from "../components/loading-text.svelte"
    import type { Attestation, Mark } from "../@types"
    import { groupBy } from "../utils"
    import Card from "../components/card.svelte"
    export let subject: string

    type Attendance = Attestation["attendance"]

    const [attestation, loading] = useAttestation()
    const getMarks = (
        attestation: Attestation[] | null,
    ): [string, Attendance][] => {
        if (!attestation) return []
        const { attendance } = attestation.filter(
            ({ subject: s }) => subject === s,
        )[0]

        return Array.from(groupBy(attendance, "type").entries())
    }

    const getSum = (marks: Mark[]) =>
        marks.reduce((sum, { value }) => sum + (parseInt(`${value}`) || 0), 0)

    $: marks = getMarks($attestation)
    $: tabNames = marks.map(([key]) => key.split("-")[0].trim())

    const MONTHS = [
        "января",
        "февраля",
        "марта",
        "апреля",
        "мая",
        "июня",
        "июля",
        "августа",
        "сентября",
        "октября",
        "ноября",
        "декабря",
    ]

    const removeAfterSymbol = (text: string, symbol: string) => {
        const index = text.indexOf(symbol)
        if (index < 0) return text
        return text.substring(0, index).trim()
    }
    const formatDay = (date: string) => {
        const [day, month] = date.split(".").map((v) => parseInt(v))
        return `${day} ${MONTHS[month - 1]}`
    }
</script>

<div class="attendance">
    <Tabs let:Content let:Wrapper let:Header let:Tab maxWidth={1140}>
        <Scaffold padding={false}>
            <AppBar slot="app-bar"
                ><LoadingText {loading} title={subject} />
                <Header slot="bottom">
                    {#each tabNames as tab}
                        <Tab>{tab}</Tab>
                    {/each}
                </Header>
            </AppBar>
            <Wrapper>
                {#each marks as [type, attendances]}
                    <Content>
                        <div class="attendences">
                            <h2 class="attendences__type">{type}</h2>
                            {#each attendances as { part, marks }}
                                <Card title={removeAfterSymbol(part, "(")}>
                                    {#each marks as { value, title }}
                                        <p>
                                            {formatDay(title)}: <b> {value}</b>
                                        </p>
                                    {/each}
                                    <p class="attendence__title">
                                        Сумма: <b>{getSum(marks)}</b>
                                    </p>
                                </Card>
                            {/each}
                        </div>
                    </Content>
                {/each}
            </Wrapper>
            <Navigation slot="navigation-bar" />
        </Scaffold>
    </Tabs>
</div>

<style>
    .attendence__subject--header {
        display: none;
    }
    @media (width >= 1140px) {
        .attendance :global(.tabs__header) {
            display: none;
        }
        .attendance :global(.tabs__wrapper) {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            margin: 0 auto;
            max-width: 1500px;
            height: unset !important;
        }
        .attendance :global(.tabs__content) {
            width: auto;
        }
        .attendance :global(.tabs__line) {
            display: none;
        }
        .attendence__subject {
            display: none;
        }
        .attendence__subject--header {
            display: block;
        }
    }
    p {
        margin: 0;
    }
    .attendences__type,
    .attendence__subject {
        margin: 0;
        font: inherit;
    }
    .attendence__subject {
        font-weight: bold;
        padding-block: var(--container-padding-block);
        padding-inline: var(--container-padding-inline);
    }
    .attendences {
        display: grid;
        gap: 1em;
        padding-inline: var(--container-padding-inline);
        padding-block: var(--container-padding-block);
        margin: 0 auto;
        max-width: 500px;
    }
    .attendence__title {
        padding-top: var(--padding);
        margin-top: var(--padding);
        border-top: 1px solid var(--md-sys-color-outline);
    }
</style>
