<script lang="ts">
    import type { Mark } from "$api"
    import { i18n, _ } from "$lib/i18n"
    import { groupBy } from "$lib/utils"

    let { marks, class: class_ = "" }: { marks: Mark[]; class?: string } =
        $props()

    let months = $derived(
        Array.from(groupBy(marks, ([date]) => date.split(".")[1]).entries())
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .map(([month, marks]) => ({
                month: dtf.format(new Date(1, parseInt(month) - 1, 1)),
                values: marks
                    .map(([date, value]) => ({
                        day: parseInt(date.split(".")[0]),
                        value,
                    }))
                    .sort(({ day: a }, { day: b }) => a - b),
            })),
    )

    let dtf = $derived(
        new Intl.DateTimeFormat(i18n.language, {
            month: "long",
        }),
    )
</script>

<div class="max-w-full overflow-x-auto {class_}">
    <table>
        <tbody>
            <tr>
                <th class="pl-4">{_("month")}</th>
                {#each months as { month, values }}
                    <td colspan={values.length} class="text-primary">{month}</td
                    >
                {/each}
            </tr>
            <tr>
                <th class="pl-4">{_("day")}</th>
                {#each months as { values }}
                    {#each values as { day }}
                        <td class="text-muted-foreground">{day}</td>
                    {/each}
                {/each}
            </tr>
            <tr>
                <th class="pl-4">{_("grade")}</th>
                {#each months as { values }}
                    {#each values as { value }}
                        <td>{value}</td>
                    {/each}
                {/each}
            </tr>
        </tbody>
    </table>
</div>

<style>
    table {
        border: none;
        border-spacing: 0;
        border-collapse: separate;
    }
    tr {
        border: none;
    }
    th {
        @apply text-left text-muted-foreground font-normal pr-2 sticky left-0 bg-background;
    }
    th,
    td {
        border-left: none;
        border-top: none;
        border-bottom: none;
        @apply border-r border-border;
    }
    td {
        @apply text-center px-2;
    }
</style>
