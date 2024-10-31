<script lang="ts">
    import { Calculator } from "$api"
    import AppBar from "$lib/components/app-bar.svelte"
    import { Button } from "$lib/components/ui/button"
    import { Input } from "$lib/components/ui/input"
    import Switch from "$lib/components/ui/switch"
    import { _ } from "$lib/i18n"
    import Page from "$lib/layouts/page.svelte"

    let {count=3} = $props()
    let message = $state("")
    let hint = $state("")
    let calculator = new Calculator(count, (type, value) => {
        message = ""
        hint = ""
        if (type === "inadmissibility") {
            message = _("calculator.inadmissibility")
            hint = _("calculator.sum-less-than", value)
        }
    })
</script>

<Page>
    {#snippet header()}
        <AppBar title={_("calculator")} />
    {/snippet}
    <div class="grid mx-auto p-4 gap-4 max-w-md">
        <table>
            <tbody>
                {#each calculator as mark, index}
                    {@const label = mark.isExam
                        ? _("calculator.exam")
                        : _("calculator.part", index + 1)}
                    {@const id = `mark-${index}`}
                    <tr>
                        <td>
                            <label for={id}>{label}</label>
                        </td>
                        <td>
                            <Input
                                disabled={mark.freeze}
                                placeholder={label}
                                {id}
                                inputmode="numeric"
                                bind:value={mark.value}
                            />
                        </td>
                        <td>
                            <label>
                                <Switch bind:checked={mark.freeze} class="mx-auto" />
                                <p class="text-sm text-center">{_("calculator.freeze")}</p>
                            </label>
                        </td>
                    </tr>
                {/each}
                <tr>
                    <td><label for="total">{_("total")}</label></td>
                    <td colspan="2">
                        <Input
                            placeholder={_("total")}
                            id="total"
                            inputmode="numeric"
                            bind:value={calculator.total}
                        />
                    </td>
                </tr>
            </tbody>
        </table>

        {#if message.length > 0 || hint.length > 0}
        <div>
            {#if message.length > 0}
                <p class="text-destructive">{message}</p>
            {/if}
            {#if hint.length > 0}
                <p class="opacity-50">{hint}</p>
            {/if}
        </div>
        {/if}
        <Button disabled={calculator.disabled} onclick={() => calculator.recalculate(70)}>{_("calculator.stipend")}</Button>
        <Button disabled={calculator.disabled} onclick={() => calculator.credits()}>{_("calculator.not-credits")}</Button>
        <Button disabled={calculator.disabled} onclick={() => calculator.recalculate(90)}>{_("calculator.get-a")}</Button>
        <Button disabled={calculator.disabled} onclick={() => calculator.recalculate()}>{_("calculator.recalculate")}</Button>
    </div>
</Page>

<style>
    td {
        @apply p-0
    }
    td:first-of-type {
        @apply pr-2
    }
    tr:not(:last-of-type) td {
        @apply pb-4
    }
</style>
