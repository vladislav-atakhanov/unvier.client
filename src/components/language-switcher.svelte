<script lang="ts">
    import { language, getLanguages } from "material/i18n"
    import { SegmentedButtons } from "material/components"
    import { updateAllStores } from "../api/data"

    const values = getLanguages()

    const onInput = () => {
        setTimeout(updateAllStores, 1000)
    }
</script>

<SegmentedButtons items={values} bind:value={$language} on:input={onInput} />
