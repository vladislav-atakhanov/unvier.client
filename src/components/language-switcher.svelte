<script lang="ts">
    import { language, getLanguages } from "material/i18n"
    import { SegmentedButtons } from "material/components"
    import { updateAllStores } from "../api/data"

    const values = getLanguages()
</script>

<SegmentedButtons
    items={values}
    bind:value={$language}
    on:input={updateAllStores}
/>
