<script>
    import { getAttestation } from "../api"
    import { onMount } from "svelte"

    let attestation = null
    onMount(() => {
        getAttestation().then(a => attestation = a)
        return () => attestation = null
    })
</script>

<div class="attestations__container container">
{#if attestation}
    {#each attestation as {subject, attestation} (subject)}
        <section class="attestation">
            <h2 class="attestation__title">{subject}</h2>
            <ul class="attestation__summary">
                {#each attestation as {title, value} (title)}
                <li class="summary">
                    <span class="summary__title">{title}</span>
                    <span class="summary__value">{value}</span>
                </li>
                {/each}
            </ul>
        </section>
    {/each}
{:else}
Loading...
{/if}
</div>

<style>
    .attestation__summary {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        gap: 1em;
    }
    .attestation {
        border-bottom: 1px solid #ccc;
        padding-block: 1em;
    }
    .attestation__title {
        margin: 0;
        font-size: 1em;
        padding-bottom: 1em;
    }
    .summary {
        flex: 1 0 0;
        display: grid;
    }
    .summary__value {
        font-weight: bold
    }
</style>