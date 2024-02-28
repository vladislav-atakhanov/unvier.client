<script>
    import { i18n } from "material/i18n"
    import { PlainTooltip } from "material/components"
    /** @type {import("../../@types").Schedule | null} */
    export let schedule

    const _ = i18n()

    /** @type {PlainTooltip} */
    let tooltip
</script>

{#if schedule?.week && tooltip}
    <div class="week" use:tooltip.use>
        {schedule?.week}
    </div>
{/if}

<PlainTooltip bind:this={tooltip}>{_("schedule.current-week")}</PlainTooltip>

<style>
    .week {
        padding-inline: 8px;
    }
</style>
