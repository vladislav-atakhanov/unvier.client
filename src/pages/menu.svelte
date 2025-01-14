<script lang="ts">
    import { routes } from "./index"
    import { Button } from "$lib/components/ui/button"
    import { _ } from "$lib/i18n"
    import {
        BookA,
        CalendarDays,
        Calculator,
        FileText,
        ListCheck,
        CircleUserRound,
        Settings,
        CircleHelp,
    } from "lucide-svelte"
    import { hostMatches } from "$lib/router"
    import { useApi } from "$api"
    import Telegram from "$lib/icons/telegram.svelte"
    import Page from "$lib/layouts/page.svelte"
    import AppBar from "$lib/components/app-bar.svelte"
    import { Separator } from "$lib/components/ui/separator"
    import { Skeleton } from "$lib/components/ui/skeleton"
    import { randInt } from "$lib/utils"

    type IconComponent = typeof BookA | typeof Telegram
    const api = useApi()

    const transcript = api.fetchTranscript()
</script>

<Page>
    {#snippet header()}
        <AppBar>
            {#snippet title()}
                Univer
            {/snippet}
        </AppBar>
    {/snippet}
    <div class="grid mx-auto p-2 gap-2 max-w-sm">
        <div class="bg-muted p-3 rounded">
            {#if transcript.data}
                {@const { fullname, education_program } = transcript.data}
                <div>
                    <p class="font-bold">{fullname}</p>
                    <p class="text-sm">{education_program}</p>
                </div>
            {:else}
                <div>
                    <p class="font-bold">
                        <Skeleton symbols={randInt(20, 45)} />
                    </p>
                    <p class="text-sm">
                        <Skeleton symbols={randInt(40, 80)} />
                    </p>
                </div>
            {/if}
        </div>
        <div class="grid grid-cols-3 mt-3">
            {@render Item(routes.schedule, _("schedule"), CalendarDays)}
            {@render Item(routes.attestation, _("attestation"), BookA)}
            {@render Item(routes.calculator, _("calculator"), Calculator)}
            {@render Item(routes.files, _("umkd"), FileText)}
            {@render Item(routes.exams, _("exams"), ListCheck)}
            {@render Item(routes.profile, _("profile"), CircleUserRound)}
        </div>
        <Separator class="my-3" />
        <div class="grid grid-cols-3">
            {@render Item(routes.telegram, "Telegram", Telegram)}
            {@render Item(routes.settings, _("settings"), Settings)}
            {@render Item(routes.faq, _("faq"), CircleHelp)}
        </div>
    </div>
</Page>

{#snippet Item(path: string, label: string, Icon: IconComponent)}
    <Button
        href={path}
        target={hostMatches(path) ? "_self" : "_blank"}
        size="lg"
        variant="ghost"
        class="grid gap-2 justify-items-center h-auto px-0 py-2"
        mode="replace"
    >
        <Icon />
        <span class="text-xs">{label}</span>
    </Button>
{/snippet}
