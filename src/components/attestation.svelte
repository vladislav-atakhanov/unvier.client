<script lang="ts">
    import { i18n } from "material/i18n"
    import type { Attestation } from "../@types"
    import { ATTESTATION } from "../url"
    import Card from "./card.svelte"
    import { getMissing, getTotal } from "../api/marks"

    export let attestation: Attestation[]

    export let wish = 70

    const _ = i18n()

    const getTitle = (index: number, length: number) =>
        index < length - 1
            ? _("calculator.part", index + 1)
            : _("calculator.exam")
</script>

{#each attestation as { subject, attestation: _attestation, sum } (subject)}
    {@const total = getTotal(
        _attestation.map(([_, m]) => m),
        sum[1],
    )}
    {@const missing = getMissing(_attestation, wish)}
    {@const missingTotal = Math.max(wish - total, 0)}
    <Card title={subject} href="{ATTESTATION}/{subject}">
        <ul class="attestation__summary">
            {#each _attestation as [title, value, active], i (title)}
                <li class="summary" class:summary--active={active}>
                    <p class="summary__label">
                        <span class="summary__title"
                            >{getTitle(i, _attestation.length)}:</span
                        >
                        <span class="summary__value">{value}</span>
                    </p>
                    <p class="summary__wish">
                        (+{missing[i]})
                    </p>
                </li>
            {/each}
            <li class="summary">
                <p class="summary__label">
                    <span class="summary__title">{_("total")}:</span>
                    <span class="summary__value">{total}</span>
                </p>
                <p class="summary__wish">(+{missingTotal})</p>
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
