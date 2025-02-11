<script lang="ts">
    import AppBar from "$lib/components/app-bar.svelte"
    import { Button } from "$lib/components/ui/button"
    import { Calculator } from "lucide-svelte"
    import { _ }from "$lib/i18n"
    import Page from "$lib/layouts/page.svelte"
    import { routes } from "./url"
    import { subject, useApi } from "$api"
    import { nullish } from "$lib/utils"
    import { Card } from "$lib/components/ui/card"
    import type { Attestation, Mark } from "$api"
    import Attendance from "$lib/components/attendance.svelte"
    import { Skeleton } from "$lib/components/ui/skeleton"

    let wish_ = $state("70")
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
        const activeValues = marks.filter(([,, active]) => active).length

        const values = marks.map(([_, value, active]) => (active ? 0 : value)).filter(v => typeof v === "number")
        if (activeValues === 0) values[values.length - 1] = 0
        return _get(values, wish).map((v, index) => {
            const other = marks[index][1]
            return Math.max(v - (typeof other === "number" ? other : 0), 0)
        })
    }

    const getTotal = (marks: number[]) => {
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

    const onclick = (value: Attestation) => () => {
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
            {#snippet bottom()}
                <label class="block mx-auto px-4 max-w-md">
                    {_("attestation.wish")}
                    <input type="text" inputmode="numeric" bind:value={wish_} class="bg-transparent text-foreground text-center w-10 border-b">
                </label>
            {/snippet}
            {#snippet right()}
                <Button size="icon" href={routes.calculator} variant="ghost">
                    <Calculator />
                </Button>
            {/snippet}
        </AppBar>
    {/snippet}



    <div class="grid mx-auto p-2 gap-2 max-w-md">
        {#if nullish(query.data)}
            {#each {length: 7} as __}
                <Card>
                    {#snippet title()}
                        <Skeleton symbols={subject()} />
                    {/snippet}
                    <ul class="flex gap-1 justify-between">
                        {#each {length: 4} as __}
                            <li class="grid">
                                <p><Skeleton symbols={8} /></p>
                                <p><Skeleton symbols={5} /></p>
                            </li>
                        {/each}
                    </ul>
                </Card>
            {/each}
        {:else}
            {#snippet mark(v: {title: string, missing: number, active: boolean, value: any})}
            <li class="grid" class:text-primary={v.active}>
                <p>
                    <span>{v.title}:</span>
                    <span class="font-bold">{v.value}</span>
                </p>
                <p>(+{v.missing})</p>
            </li>
            {/snippet}

            {#each query.data as a (a.subject)}
                {@const { subject, attestation } = a}
                {@const total = getTotal(
                    attestation.map(([_, m]) => m).filter(m => typeof m === "number"),
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
                            <p>
                                <span>{_("total")}:</span>
                                <span class="font-bold">{total}</span>
                            </p>
                            <p>(+{missingTotal})</p>
                        </li>
                    </ul>
                </Card>
            {:else}
                {_("no-data")}
            {/each}
        {/if}
    </div>
</Page>