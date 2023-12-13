<script>
    import { useAttestation } from "../api"
    import Attestation from "../components/attestation.svelte"
    import { Scaffold, AppBar } from "material/components"
    import Navigation from "../components/navigation.svelte"
    import LoadingText from "../components/loading-text.svelte"
    import { onMount } from "svelte"

    const [attestation, loading] = useAttestation()

    const DEFAULT_WISH = "70"

    let wishString = DEFAULT_WISH
    $: wish = Math.min(100, Math.max(parseInt(wishString), 0)) || 0
    const select = (event) => {
        event.target.select()
    }

    onMount(() => {
        const localWish = localStorage.getItem("wish")
        if (wishString === DEFAULT_WISH && localWish)
            wishString = localWish
    })

    $: wishString !== DEFAULT_WISH && localStorage.setItem("wish", wishString)

</script>

<Scaffold>
    <AppBar slot="app-bar">
        <LoadingText {loading} title="Оценки" />
    </AppBar>
    <label class="wish">
        Желаемая оценка
        <span class="wish__input">
            <input type="text" inputmode="numeric" bind:value={wishString} on:click={select} />
            <span class="wish__value"><span>{wish}</span></span>
        </span>
    </label>
    <div class="attestations__container">
        {#if $attestation}
            <Attestation attestation={$attestation} {wish} />
        {/if}
    </div>
    <Navigation on:update={attestation.refresh} slot="navigation-bar" />
</Scaffold>

<style>
    .attestations__container {
        display: grid;
    }
    @media (800px <= width < 1280px) {
        .attestations__container {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            column-gap: 2em;
        }
    }
    @media (width >= 1280px) {
        .attestations__container {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            column-gap: 3em;
            --padding-block: 2em;
        }
    }
    label {
        display: flex;
        align-items: center;
        gap: 1em;
        white-space: nowrap;
        margin-bottom: 1em;
    }
    input {
        border: none;
        background-color: transparent;
        width: 30px;
        text-align: right;
        padding: 0;
    }
    .wish__input {
        position: relative;
    }
    .wish__value span {
        color: transparent
    }
    .wish__value {
        position: absolute;
        text-decoration: underline;
        right: 0;
        transform: translateY(.1em)
    }
    input:focus {
        outline: 0
    }
    input:focus + .wish__value {
        color: red;
    }

</style>