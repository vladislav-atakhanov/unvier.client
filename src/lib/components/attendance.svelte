<script lang="ts">
    import * as Drawer from "./ui/drawer"
    import * as Tabs from "./ui/tabs"

    import { _ } from "$lib/i18n"
    import type { Attestation, Mark } from "$api"
    import Marks from "./marks.svelte"
    import { groupBy } from "$lib/utils"

    let attestation = $state<Attestation>()
    let isOpen = $state(false)
    export function open(value: Attestation) {
        attestation = value
        isOpen = true
    }
    export function close() {
        attestation = undefined
    }
    let groups = $derived(
        attestation
            ? groupBy(
                  attestation.attendance,
                  ({ part }) => part.split("(")[0],
              )
            : new Map<string, Attestation["attendance"]>(),
    )

    let activeTab = $derived(
        Array.from(groups.keys())
            .reduce((active, value) =>
                active.localeCompare(value) === 1 ? active : value,
            ),
    )
    const getSum = (marks: Mark[]) =>
        marks.reduce((sum, [_, value]) => sum + (parseInt(`${value}`) || 0), 0)
</script>

<Drawer.Root onClose={close} bind:open={isOpen}>
    <Drawer.Content class="mx-auto w-[90%] max-h-[96%] max-w-sm">
        {#if attestation}
            <Drawer.Header class="px-4 pb-2">
                <Drawer.Title class="text-balance text-left"
                    >{attestation.subject}</Drawer.Title
                >
            </Drawer.Header>
            {#snippet content(attendance: Attestation["attendance"])}
                <div class="space-y-2">
                    {#each attendance as { marks, type }}
                        <div>
                            <p class="px-4">{type}</p>
                            <p class="px-4">
                                {_("sum")}: <b>{getSum(marks)}</b>
                            </p>
                            <Marks class="pb-2" {marks} />
                        </div>
                    {/each}
                </div>
            {/snippet}
            {#if groups.size > 1}
                <Tabs.Root class="overflow-y-auto" value={activeTab}>
                    {#each groups.entries() as [key, value]}
                        <Tabs.Content class="mt-0" value={key}>
                            {@render content(value)}
                        </Tabs.Content>
                    {/each}
                    <Drawer.Footer class="px-4 pt-2">
                        <Tabs.List>
                            {#each groups as [key]}
                                <Tabs.Trigger class="flex-1" value={key}>{key}</Tabs.Trigger>
                            {/each}
                        </Tabs.List>
                    </Drawer.Footer>
                </Tabs.Root>
            {:else}
                <div class="overflow-y-auto">
                    {#each groups as [_, value]}
                        {@render content(value)}
                    {/each}
                    <div class="mx-4 mb-4 mt-2 bg-foreground text-background flex h-10 items-center justify-center rounded-md p-1">
                        {#each groups as [key]}
                            {key}
                        {/each}
                    </div>
                </div>
            {/if}

        {:else}
            {_("no-data")}
        {/if}
    </Drawer.Content>
</Drawer.Root>
