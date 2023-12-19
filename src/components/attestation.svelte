<script lang="ts">
    import type { Attestation } from "../@types"
    import { ATTESTATION } from "../url"
    import Card from "./card.svelte"

    export let attestation: Attestation[]

    export let wish = 70
    // (рк1 + р2) * 0.3 + x * 0.4 = wish
    const isLastIndex = <T,>(array: Array<T>, index: number) =>
        index == array.length - 1
    const getNeed = (marks: Attestation["attestation"], wish: number) => {
        const sum = marks.reduce(
            (acc, [_, value], index) =>
                isLastIndex(marks, index) ? acc : acc + value,
            0,
        )
        return Math.max(Math.ceil((wish * 10 - sum * 3) / 4), 0)
    }

    const needShow = (marks: Attestation["attestation"], i) => {
        const sum = marks.reduce(
            (acc, [_, value], index) =>
                isLastIndex(marks, index) ? acc : acc + value,
            0,
        )
        return sum >= 100 && isLastIndex(marks, i)
    }

    export const getTotal = (marks: Attestation["attestation"]) => {
        const examWeight = 0.4
        const exam = marks.at(-1)?.[1] || 0
        const otherSum = marks
            .slice(0, -1)
            .reduce((sum, [_, value]) => sum + value, 0)
        return Math.round(
            exam * examWeight +
                (otherSum * (1 - examWeight)) / (marks.length - 1),
        )
    }
</script>

{#each attestation as { subject, attestation: _attestation }, index (subject)}
    {@const total = getTotal(_attestation)}
    <Card title={subject} href="{ATTESTATION}/{subject}">
        <ul class="attestation__summary">
            {#each _attestation as [title, value, active], i (title)}
                <li class="summary" class:summary--active={active}>
                    <p class="summary__label">
                        <span class="summary__title">{title}:</span>
                        <span class="summary__value">{value}</span>
                    </p>
                    {#if needShow(_attestation, i)}
                        <p class="summary__wish">
                            (+{getNeed(_attestation, wish)})
                        </p>
                    {/if}
                </li>
            {/each}
            <li class="summary">
                <p class="summary__label">
                    <span class="summary__title">Итог:</span>
                    <span class="summary__value">{total}</span>
                </p>
                <p class="summary__wish">(+{Math.max(wish - total, 0)})</p>
            </li>
        </ul>
    </Card>
{/each}

<style>
    .attestation__summary {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        gap: 1em;
        justify-content: space-between;
    }

    p {
        margin: 0;
    }
    .summary--active {
        color: var(--md-sys-color-primary);
    }
    .summary {
        display: grid;
    }
    .summary__value {
        font-weight: bold;
    }
    .summary__label {
        white-space: nowrap;
    }
</style>
