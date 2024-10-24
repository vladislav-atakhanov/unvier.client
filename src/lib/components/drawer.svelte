<script lang="ts">
    import { routes } from "../../pages"
    import { Button } from "./ui/button"
    import { Separator } from "./ui/separator"
    import { _ } from "$lib/i18n"
    import { BookA, CalendarDays, Calculator, FileText, ListCheck, CircleUserRound, Settings, CircleHelp } from "lucide-svelte"
    import { useRouter } from "$lib/router"
    import { useApp } from "../../app.svelte"
    import { fetchTranscript } from "$api"
    import Loader from "$lib/components/loader.svelte"

    const router = useRouter()

    const app = useApp()
</script>

{#snippet Item(path: string, label: string, Icon: typeof BookA)}
<Button
    href={path}
    size="sm"
    variant={router.path === path ? "default" : "ghost"}
    class="justify-start dark:bg-muted dark:hover:bg-muted dark:text-white dark:hover:text-white gap-2"
    mode="replace"
    onclick={() => app.drawerState = "close"}
>
    <Icon />
    {label}
</Button>
{/snippet}

<aside class="h-screen relative max-w-xs" bind:this={app.drawer}>
    <div
        class="mb-4 justify-start w-full"
    >
        {#await fetchTranscript()}
            <Loader />
        {:then {fullname}}
            {fullname}
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
        {@render Item(routes.telegram, "Telegram", CircleUserRound)}
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
