<script lang="ts">
    import type { Attestation } from "../@types"

    export let attestation: Attestation[]

    export let wish = 70
    // (рк1 + р2) * 0.3 + x * 0.4 = wish
    const isLastIndex = <T,>(array: Array<T>, index: number) =>
        index == array.length - 1
    const getNeed = (marks: Attestation["attestation"], wish: number) => {
        const sum = marks.reduce(
            (acc, { value }, index) =>
                isLastIndex(marks, index) ? acc : acc + value,
            0,
        )
        return Math.max(Math.ceil((wish * 10 - sum * 3) / 4), 0)
    }

    const needShow = (marks: Attestation["attestation"], i) => {
        const sum = marks.reduce(
            (acc, { value }, index) =>
                isLastIndex(marks, index) ? acc : acc + value,
            0,
        )
        return sum >= 100 && isLastIndex(marks, i)
    }
</script>

{#each attestation as { subject, attestation: _attestation }, index (subject)}
    <section class="attestation">
        <h2 class="attestation__title">{subject}</h2>
        <ul class="attestation__summary">
            {#each _attestation as { title, value }, i (title)}
                <li class="summary">
                    <p>
                        <span class="summary__title">{title}:</span>
                        <span class="summary__value">{value}</span>
                    </p>
                    <p class="summary__wish">
                        {#if needShow(_attestation, i)}
                            (+{getNeed(_attestation, wish)})
                        {/if}
                    </p>
                </li>
            {/each}
        </ul>
    </section>
{/each}

<style>
    .attestation__summary {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        gap: 1em;
    }
    .attestation {
        border-top: 1px solid var(--md-sys-color-outline);
        padding-block: var(--padding-block, 1em);
    }
    .attestation__title {
        margin: 0;
        font-size: 1em;
        padding-bottom: 1em;
    }
    p {
        margin: 0;
    }
    .summary {
        flex: 1 0 0;
        display: grid;
    }
    .summary__value {
        font-weight: bold;
    }
</style>
