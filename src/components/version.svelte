<script context="module">
    export const clientVersion = "VPjRDPsy"
</script>

<script>
    import { useServerVersion } from "../api"
    import { i18n } from "material/i18n"
    const _ = i18n()

    const [serverVersion] = useServerVersion()

    $: needUpdate = $serverVersion !== null && clientVersion !== $serverVersion
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
