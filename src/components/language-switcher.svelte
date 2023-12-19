<script lang="ts">
    import { language, getLanguages } from "material/i18n"
    import { SegmentedButtons } from "material/components"
    import { clearLocalStorage } from "../api/auth"

    const values = getLanguages()
</script>

<SegmentedButtons
    items={values}
    bind:value={$language}
    on:change={clearLocalStorage}
/>
