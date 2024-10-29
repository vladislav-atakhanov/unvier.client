<script lang="ts">
    import AppBar from "$lib/components/app-bar.svelte"
    import { Button } from "$lib/components/ui/button"
    import { Calculator } from "lucide-svelte"
    import { _ }from "$lib/i18n"
    import Page from "$lib/layouts/page.svelte"
    import { routes } from "./url"
    import { useApi } from "$api"
    import Loader from "$lib/components/loader.svelte"
    import { nullish } from "$lib/utils"
    import { Card } from "$lib/components/ui/card"
    import type { Attestation, Mark } from "$api"
    import Attendance from "$lib/components/attendance.svelte"

    let wish_ = "70"
    let wish = $derived(parseFloat(wish_.replaceAll(",", ".")))

    const isExam = (index: number, count: number) => index === count - 1

    const getWeight = (index: number, count: number) =>
    isExam(index, count) ? 4 : 6 / (count - 1)

    const api = useApi()
    const query = api.fetchAttestation()

    const _get = (values: number[], wish: number) => {
        const sum = values.reduce(
            (acc, v, index) => acc + v * getWeight(index, values.length),
            0
        )
        if (sum === 0) return values.map((_) => wish)

        const zerosCount = values.filter((v) => v === 0).length

        const c = zerosCount > 1 ? 6 / (values.length - 1) : 0
        const x = Math.round((10 * wish - sum) / (c + 4))

        return values.map((v) => (v > 0 ? v : x))
    }


    const getMissing = (marks: Mark[], wish: number) => {
        const activeValues = marks.filter(([t, v, active]) => active).length

        const values = marks.map(([_, value, active]) => (active ? 0 : value))
        if (activeValues === 0) values[values.length - 1] = 0
        return _get(values, wish).map((v, index) =>
            Math.max(v - marks[index][1], 0)
        )
    }

    const getTotal = (marks: number[], sum: number) => {
        const fullSum = marks.reduce((acc, i) => acc + i)
        const examValue = marks[marks.length - 1]
        if (examValue !== 0 && examValue === sum) return sum
        const sumWithoutExam = fullSum - examValue
        if (sumWithoutExam === 0) return sum
        return Math.floor(
            marks.reduce(
                (t, mark, index) => t + mark * getWeight(index, marks.length),
                0
            ) / 10
        )
    }
    const getTitle = (index: number, length: number) =>
        index < length - 1
            ? _("calculator.part", index + 1)
            : _("calculator.exam")

    const onclick = (value: Attestation["attendance"]) => () => {
        attendance?.open(value)
    }
    let attendance: any

</script>

<Attendance bind:this={attendance} />

<Page>
    {#snippet header()}
        <AppBar>
            {#snippet title()}
                {#if query.state === "update"}
                    {_("updating")}
                {:else}
                    {_("attestation")}
                {/if}
            {/snippet}
            {#snippet right()}
                <Button size="icon" href={routes.calculator} variant="ghost">
                    <Calculator />
                </Button>
            {/snippet}
        </AppBar>
    {/snippet}



    <div class="grid mx-auto p-4 gap-2 max-w-md">
        {#if query.state === "load"}
            <Loader />
        {:else if !nullish(query.data)}
            {#snippet mark(v: {title: string, missing: number, active: boolean, value: any})}
            <li class="grid" class:text-primary={v.active}>
                <p class="summary__label">
                    <span class="summary__title"
                        >{v.title}:</span
                    >
                    <span class="font-bold">{v.value}</span>
                </p>
                <p class="summary__wish">(+{v.missing})</p>
            </li>
            {/snippet}

            {#each query.data as a (a.subject)}
                {@const { subject, attestation, sum } = a}
                {@const total = getTotal(
                    attestation.map(([_, m]) => m).filter(m => typeof m === "number"),
                    parseInt(`${sum[1]}`),
                )}
                {@const missing = getMissing(attestation, wish)}
                {@const missingTotal = Math.max(wish - total, 0)}
                <Card title={subject} onclick={onclick(a)}>
                    <ul class="flex gap-1 justify-between">
                        {#each attestation as [title, value, active], i (title)}
                            {@render mark({
                                title: getTitle(i, attestation.length),
                                active: active ?? false,
                                value: value,
                                missing: missing[i]
                            })}
                        {/each}
                        <li class="grid">
                            <p class="summary__label">
                                <span class="summary__title">{_("total")}:</span>
                                <span class="font-bold">{total}</span>
                            </p>
                            <p class="summary__wish">(+{missingTotal})</p>
                        </li>
                    </ul>
                </Card>

            {:else}
                {_("no-data")}
            {/each}
        {/if}
    </div>
</Page>