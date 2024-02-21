<script>
    /** @type {import("../../@types").Schedule | null} */
    export let schedule
</script>

{#if schedule?.week}
    <div class="week">
        {schedule?.week}
    </div>
{/if}

<style>
    .week {
        padding-inline: 8px;
    }
</style>
