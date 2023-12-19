<script>
    import { useAttestation } from "../api"
    import Attestation from "../components/attestation.svelte"
    import { Scaffold, AppBar, IconButton } from "material/components"
    import Navigation from "../components/navigation.svelte"
    import LoadingText from "../components/loading-text.svelte"
    import { onMount } from "svelte"
    import { CALCULATOR } from "../url"

    import { i18n } from "material/i18n"
    const _ = i18n()

    const [attestation, loading] = useAttestation()

    const DEFAULT_WISH = "70"
    const WISH_KEY = "wish"

    let wishString = DEFAULT_WISH
    $: wish = Math.min(100, Math.max(parseInt(wishString), 0)) || 0

    /** @param {any} event */
    const select = (event) => event.target.select()
    const blur = () => {
        // @ts-ignore
        document.activeElement?.blur()
    }

    let isMount = false
    onMount(() => {
        const localWish = localStorage.getItem(WISH_KEY)
        if (wishString === DEFAULT_WISH && localWish) wishString = localWish
        isMount = true
        attestation.updateIfNeed()
    })

    /** @param {string} wish*/
    const setWish = (wish) => {
        if (isMount === false) return
        wish === DEFAULT_WISH
            ? localStorage.removeItem(WISH_KEY)
            : localStorage.setItem(WISH_KEY, wishString)
    }

    $: setWish(wishString)
</script>

<Scaffold>
    <AppBar slot="app-bar">
        <LoadingText {loading} title={_("attestation")} />
        <IconButton slot="actions" href={CALCULATOR} icon="calculate" />
        <label class="wish" slot="bottom">
            {_("attestation.wish")}
            <form class="wish__input" on:submit|preventDefault={blur}>
                <input
                    type="text"
                    inputmode="numeric"
                    bind:value={wishString}
                    on:click={select}
                />
                <span class="wish__value"><span>{wish}</span></span>
            </form>
        </label>
    </AppBar>

    <div class="attestations__container">
        {#if $attestation}
            <Attestation attestation={$attestation} {wish} />
        {/if}
    </div>
    <Navigation on:update={attestation.update} slot="navigation-bar" />
</Scaffold>

<style>
    .attestations__container {
        display: grid;
        gap: 1em;
        margin: 0 auto;
        max-width: 500px;
    }
    .wish {
        display: flex;
        align-items: center;
        gap: 1em;
        white-space: nowrap;
        padding-bottom: 4px;
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
        color: transparent;
    }
    .wish__value {
        position: absolute;
        text-decoration: underline;
        right: 0;
        transform: translateY(0.1em);
    }
    input:focus {
        outline: 0;
    }
    input:focus + .wish__value {
        color: var(--md-sys-color-primary);
    }
</style>
