<script lang="ts">
    import type { Readable } from "svelte/store"

    export let loading: Readable<boolean>
    export let title: string
</script>

{$loading ? "Обновление..." : title}
