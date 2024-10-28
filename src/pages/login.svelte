<script lang="ts">
    import { CircleHelp, Settings, Eye, EyeOff, MonitorDown } from "lucide-svelte"
    import { Button } from "$lib/components/ui/button"
    import * as Radio from "$lib/components/ui/segmented-radio"
    import { Input } from "$lib/components/ui/input"
    import { Label } from "$lib/components/ui/label"
    import { Checkbox } from "$lib/components/ui/checkbox"

    import { routes } from "./url"
    import { useApi } from "../api"

    import { _ } from "$lib/i18n"
    import Page from "$lib/layouts/page.svelte"
    import AppBar from "$lib/components/app-bar.svelte"
    import { useRouter } from "$lib/router"
    import { onMount } from "svelte"
    import { useApp } from "../app.svelte"
    import InstallButton from "$lib/components/install-button.svelte"
    import Telegram from "$lib/icons/telegram.svelte"
    import Loader from "$lib/components/loader.svelte"

    const univers = {
        kstu: "KSTU",
        kaznu: "KazNU",
    }
    const api = useApi()
    let univer = $state<keyof typeof univers>("kstu")
    let username = $state("")
    let password = $state("")
    let status = $state<"ready" | "loading" | "error">("ready")
    let agree = $state(false)
    let error = $state("")

    let active = $derived(username.length && agree && password.length && univer)
    let disabled = $derived(status == "loading" ? true : !active)
    const router = useRouter()
    const app = useApp()

    onMount(() => {
        univer = (localStorage.getItem("univer") as any) ?? "kstu"
        username = localStorage.getItem("username") ?? ""
        api.version.fetch()
    })

    const onsubmit = async (event: SubmitEvent) => {
        event.preventDefault()
        status = "loading"
        const s = await api.login({
            password,
            univer,
            username,
        })
        if (s === 200) {
            router.navigate(routes.home, {mode: "replace"})
            app.isAuth = true
            return
        }
        status = "ready"
        if (s === 401) {
            error = _("error.invalid-credentials")
            return
        }
        error = _("error.connection-error")
    }
    let showPassword = $state(false)
</script>

<Page class="grid grid-rows-min-auto-min">
    {#snippet header()}
    <AppBar>
        {#snippet left()}
        <Button variant="ghost" size="icon" href={routes.faq}
            ><CircleHelp /></Button
        >
        {/snippet}
        {#snippet right()}
        <div class="flex gap-2">
            <InstallButton>
                {#snippet children(onclick)}
                    <Button variant="ghost" size="icon" {onclick}>
                        <MonitorDown />
                    </Button>
                {/snippet}
            </InstallButton>
            <Button variant="ghost" size="icon" href={routes.telegram} target="_blank">
                <Telegram />
            </Button>
            <Button variant="ghost" size="icon" href={routes.settings}>
                <Settings />
            </Button>
        </div>
        {/snippet}
    </AppBar>
    {/snippet}

    <form
        class="w-full max-w-[370px] justify-self-center grid gap-5 self-center px-4"
        {onsubmit}
    >
        <Radio.Root
            bind:value={univer}
            name="univer"
        >
            {#each Object.entries(univers) as [value, label]}
                <Radio.Item {value}>{label}</Radio.Item>
            {/each}
        </Radio.Root>

        <Label class="flex w-full max-w-sm flex-col gap-1.5"
            >{_("username")}
            <Input
                type="text"
                bind:value={username}
                name="username"
                placeholder="atakhanov.vladislav"
            />
        </Label>

        <Label class="flex w-full max-w-sm flex-col gap-1.5"
            >{_("password")}
            <div class="relative">
                <Input
                    type={showPassword ? "text" : "password"}
                    bind:value={password}
                    name="password"
                    placeholder={showPassword ? api.version.client : "●●●●●●●●●" }
                />
                <Button
                    variant="ghost"
                    type="button"
                    size="icon"
                    class="absolute right-0 top-0"
                    onclick={() => (showPassword = !showPassword)}
                >
                    {#if showPassword}
                        <EyeOff />
                    {:else}
                        <Eye />
                    {/if}
                </Button>
            </div>
        </Label>

        <Label class="flex items-center gap-2">
            <Checkbox id="terms" bind:checked={agree} name="agree" />
            <div class="privacy text-sm">
                {@html _("privacy-policy.agree", routes.privacy)}
            </div>
        </Label>
        {#if error}
            <p class="text-destructive">
                {error}
            </p>
        {/if}
        <Button {disabled} type="submit"
            >{status === "loading" ? _("loading") : _("login")}</Button
        >
    </form>
    <div class="flex justify-center p-4">
        {#if api.version.update}
            <p class="text-destructive">{_("version.update-required")}</p>
        {:else if api.version.loading}
            <Loader class="text-muted-foreground" />
        {:else}
            <p class="text-muted-foreground">{api.version.client}</p>
        {/if}
    </div>
</Page>

<style>
    .privacy :global(a) {
        @apply text-primary underline hover:no-underline;
    }
</style>
