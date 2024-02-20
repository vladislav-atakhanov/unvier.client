<script>
    /** @type {import("../../@types").Schedule | null} */
    export let schedule
</script>

<div class="week">{schedule?.week}</div>

<style>
    .week {
        padding-inline: 8px;
    }
</style>
