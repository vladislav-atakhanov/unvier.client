<script context="module">
    export const clientVerion = "84a4a631"
</script>

<script>
    import { useServerVersion } from "../api"
    import LoadingText from "./loading-text.svelte"
    import { i18n } from "material/i18n"
    const _ = i18n()

    const [serverVersion, loading] = useServerVersion()

    $: needUpdate = $serverVersion !== null && clientVerion !== $serverVersion
</script>

{#if needUpdate}
    <p class="version">
        {_("version.update-required")}
    </p>
{/if}

<style>
    .version {
        margin: 0;
    }
</style>
