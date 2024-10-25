<script lang="ts">
    import { routes } from "../../pages"
    import { Button } from "./ui/button"
    import { Separator } from "./ui/separator"
    import { _, i18n } from "$lib/i18n"
    import { BookA, CalendarDays, Calculator, FileText, ListCheck, CircleUserRound, Settings, CircleHelp } from "lucide-svelte"
    import { hostMatches, useRouter } from "$lib/router"
    import { useApp } from "../../app.svelte"
    import { fetchTranscript } from "$api"
    import Loader from "$lib/components/loader.svelte"
    import Telegram from "$lib/icons/telegram.svelte"

    type IconComponent = typeof BookA | typeof Telegram
    const router = useRouter()
    const app = useApp()
</script>

{#snippet Item(path: string, label: string, Icon: IconComponent)}
{@const active = router.path === path}
<Button
    href={path}
    target={hostMatches(path) ? "_self" : "_blank"}
    size="lg"
    variant={active ? "default" : "ghost"}
    class="{active ? "" : "bg-transparent"} justify-start gap-2"
    mode="replace"
    onclick={() => app.drawerState = "close"}
>
    <Icon />
    {label}
</Button>
{/snippet}

<aside class="h-screen relative max-w-xs bg-background z-10" bind:this={app.drawer}>
    <div
        class="justify-start w-full bg-muted p-4 h-48 grid items-end gap-2"
    >
        {#await app.query(() => fetchTranscript(i18n.language))}
            <Loader />
        {:then {fullname, education_program}}
            <div>
                <p class="font-bold">{fullname}</p>
                <p class="text-sm">{education_program}</p>
            </div>
        {/await}
    </div>
    <div class="grid gap-1 p-4">
        {@render Item(routes.schedule, _("schedule"), CalendarDays)}
        {@render Item(routes.attestation, _("attestation"), BookA)}
        {@render Item(routes.calculator, _("calculator"), Calculator)}
        {@render Item(routes.umkd, _("umkd"), FileText)}
        {@render Item(routes.exams, _("exams"), ListCheck)}
        {@render Item(routes.profile, _("profile"), CircleUserRound)}
        <Separator class="my-2" />
        {@render Item(routes.telegram, "Telegram", Telegram)}
        {@render Item(routes.settings, _("settings"), Settings)}
        {@render Item(routes.faq, _("faq"), CircleHelp)}
    </div>

    <Separator
        orientation="vertical"
        class="absolute right-0 z-1 h-full top-0"
    />
</aside>

<style>
    aside {
        width: calc(100vw - 50px);
        flex: 0 0 calc(100vw - 50px);
    }
</style>
