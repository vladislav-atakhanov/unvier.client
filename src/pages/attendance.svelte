<script lang="ts">
    import { Scaffold, AppBar, Tabs } from "material/components"
    import Navigation from "../components/navigation.svelte"
    import { useAttestation } from "../api"
    import LoadingText from "../components/loading-text.svelte"
    import type { Attestation, Mark } from "../@types"
    import { groupBy } from "../utils"
    import Card from "../components/card.svelte"
    import { addSnack } from "material/notificator"

    import { i18n, language } from "material/i18n"
    const _ = i18n()
    export let index: string

    type Attendance = Attestation["attendance"]

    const [attestation, loading] = useAttestation()
    const getMarks = (
        attestation: Attestation[] | null,
    ): [string, Attendance][] => {
        if (!attestation) return []
        const { attendance } = attestation[parseInt(index)]
        return Array.from(groupBy(attendance, "type").entries())
    }

    const getSum = (marks: Mark[]) =>
        marks.reduce((sum, [_, value]) => sum + (parseInt(`${value}`) || 0), 0)

    $: marks = getMarks($attestation)
    $: tabNames = marks.map(([key]) => key.split("-")[0].trim())
    $: subject = $attestation ? $attestation[parseInt(index)].subject : ""

    const removeAfterSymbol = (text: string, symbol: string) => {
        const index = text.indexOf(symbol)
        if (index < 0) return text
        return text.substring(0, index).trim()
    }

    $: dtf = new Intl.DateTimeFormat($language, {
        month: "long",
        day: "numeric",
    })
    const formatDay = (date: string) => {
        const [day, month] = date.split(".").map((v) => parseInt(v))
        const m = `${month}`.padStart(2, "0")
        const d = `${day}`.padStart(2, "0")
        const dateString = `2020-${m}-${d}`
        return dtf.format(new Date(dateString))
    }
</script>

<div class="attendance" style:--columns={marks.length}>
    <Tabs let:Content let:Wrapper let:Header let:Tab maxWidth={1140}>
        <Scaffold padding={false}>
            <AppBar slot="app-bar" on:title-click={() => addSnack(subject)}
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
                        <div class="attendances">
                            <h2 class="attendances__type">{type}</h2>
                            {#each attendances as { part, marks }}
                                <Card title={removeAfterSymbol(part, "(")}>
                                    {#each marks as [title, value]}
                                        <p>
                                            {formatDay(title)}: <b> {value}</b>
                                        </p>
                                    {/each}
                                    <p class="attendance__title">
                                        {_("sum")}: <b>{getSum(marks)}</b>
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
    @media (width >= 1140px) {
        .attendance :global(.tabs__header) {
            display: none;
        }
        .attendance :global(.tabs__wrapper) {
            --_columns: var(--columns, 3);
            display: grid;
            grid-template-columns: repeat(var(--_columns), 1fr);
            margin: 0 auto;
            max-width: calc(var(--_columns) * 500px);
            height: unset !important;
        }
        .attendance :global(.tabs__content) {
            width: auto;
        }
        .attendance :global(.tabs__line) {
            display: none;
        }
    }
    p {
        margin: 0;
    }
    .attendances__type {
        margin: 0;
        font: inherit;
    }
    .attendances {
        display: grid;
        gap: 1em;
        padding-inline: var(--container-padding-inline);
        padding-block: var(--container-padding-block);
        margin: 0 auto;
        max-width: 500px;
    }
    .attendance__title {
        padding-top: var(--padding);
        margin-top: var(--padding);
        border-top: 1px solid var(--md-sys-color-outline);
    }
</style>
