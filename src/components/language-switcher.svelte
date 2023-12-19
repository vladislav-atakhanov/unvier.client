<script lang="ts">
    import { language, getLanguages } from "material/i18n"
    import { SegmentedButtons } from "material/components"
    import { updateAllStores } from "../api/data"
    import { debounce } from "../utils"

    const values = getLanguages()
</script>

<SegmentedButtons
    items={values}
    bind:value={$language}
    on:input={debounce(updateAllStores, 1000)}
/>
