<script lang="ts">
    import { CircleHelp, Settings, Eye, EyeOff } from "lucide-svelte"
    import { Button } from "$lib/components/ui/button"
    import * as Select from "$lib/components/ui/select"
    import { Input } from "$lib/components/ui/input"
    import { Label } from "$lib/components/ui/label"
    import { Checkbox } from "$lib/components/ui/checkbox"

    import { PRIVACY_POLICY, SETTINGS, FAQ } from "./url"
    import { login } from "../api"

    const univers = {
        kstu: "KSTU",
        kaznu: "KazNU",
    }
    let univer = $state<keyof typeof univers>("" as any)
    let username = $state("")
    let password = $state("")
    let status = $state<"ready" | "loading" | "error">("ready")
    let agree = $state(false)
    let error = $state("")

    const _ = (v: string) => v

    let active = $derived(username.length && agree && password.length && univer)
    let disabled = $derived(status == "loading" ? true : !active)

    const onsubmit = async (event: SubmitEvent) => {
        event.preventDefault()
        status = "loading"
        const s = await login({
            password,
            univer,
            username,
        })
        if (s === 200) {
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

    const navigate = (path: string) => {}
</script>

<div class="page">
    <header class="flex justify-between p-2">
        <Button variant="ghost" size="icon" onclick={() => navigate(FAQ)}
            ><CircleHelp /></Button
        >
        <div class="flex gap-4">
            <Button
                variant="ghost"
                size="icon"
                onclick={() => navigate(SETTINGS)}><Settings /></Button
            >
        </div>
    </header>

    <form
        class="max-w-90 justify-self-center grid gap-4 self-center"
        {onsubmit}
    >
        <Select.Root
            onSelectedChange={({ value }) => (univer = value)}
            name="univer"
        >
            <Select.Trigger>
                <Select.Value placeholder="Univer" />
            </Select.Trigger>
            <Select.Content>
                {#each Object.entries(univers) as [value, label]}
                    <Select.Item {value}>{label}</Select.Item>
                {/each}
            </Select.Content>
        </Select.Root>

        <Label class="flex w-full max-w-sm flex-col gap-1.5"
            >{_("username")}
            <Input
                type="text"
                bind:value={username}
                name="username"
                placeholder="vladislav.atakhanov"
            />
        </Label>

        <Label class="flex w-full max-w-sm flex-col gap-1.5"
            >{_("password")}
            <div class="relative">
                <Input
                    type={showPassword ? "text" : "password"}
                    bind:value={password}
                    name="password"
                    placeholder={_("password")}
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

        <Label class="flex align-center gap-2">
            <Checkbox id="terms" bind:checked={agree} name="agree" />
            {@html _("privacy-policy.agree", PRIVACY_POLICY)}
        </Label>
        {#if error}
            <p class="text-muted-foreground text-sm">
                {error}
            </p>
        {/if}
        <Button {disabled} type="submit"
            >{status === "loading" ? _("loading") : _("login")}</Button
        >
    </form>
    <p class="m-0 p-4 text-center text-muted-foreground">version</p>
</div>

<style>
    .page {
        display: grid;
        grid-template-rows: min-content 1fr min-content;
    }
</style>
