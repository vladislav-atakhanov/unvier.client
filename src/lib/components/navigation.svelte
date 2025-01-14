<script lang="ts">
    import { _ } from "$lib/i18n"
    import {
        BookA,
        CalendarDays,
        CircleUserRound,
        type Icon as IconType,
        MonitorDown,
        Menu,
    } from "lucide-svelte"
    import { routes } from "../../pages"
    import { useApp } from "../../app.svelte"
    import { Separator } from "./ui/separator"
    import InstallButton from "./install-button.svelte"
    import { useRouter } from "$lib/router"

    const router = useRouter()
</script>

{#snippet Item(href: string, label: string, Icon: typeof IconType)}
    {@const active = router.path === href}
    <!-- svelte-ignore a11y_role_supports_aria_props_implicit -->
    <a {href} class="button" aria-selected={active} mode="replace">
        <div class="icon"><Icon class="mx-auto" /></div>
        {label}
    </a>
{/snippet}

<nav class="bg-background">
    <Separator />
    <ul class="flex p-2">
        {@render Item(routes.attestation, _("attestation"), BookA)}
        {@render Item(routes.schedule, _("schedule"), CalendarDays)}
        <InstallButton class="button">
            {#snippet children(onclick)}
                <button {onclick}>
                    <div><MonitorDown class="mx-auto" /></div>
                    {_("install")}
                </button>
            {/snippet}
        </InstallButton>
        {@render Item(routes.menu, _("menu"), Menu)}
    </ul>
</nav>

<style>
    nav :global(.button) {
        @apply flex-1 text-center text-xs transition-all aria-selected:text-primary aria-selected:font-bold;
    }
    nav :global(.button div) {
        @apply flex-shrink-0 py-1 px-2  transition-all hover:text-primary;
    }
</style>
