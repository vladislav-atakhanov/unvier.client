<script lang="ts">
    import { onMount, type Snippet } from "svelte"
    interface BeforeInstallPromptEvent {
        prompt: () => void
        userChoice: Promise<{ outcome: "accepted" }>
    }

    let canInstall = $state(false)
    let disabled = $state(true)
    let installEvent = $state<BeforeInstallPromptEvent>()

    let {
        class: class_ = "",
        tag = "div",
        children
    }: {
        class?: string
        tag?: string
        children: Snippet<[() => void]>
    } = $props()

    const onInstall = () => {
        canInstall = false
        installEvent = undefined
    }

    const onBeforeInstallPrompt = (event: any) => {
        event.preventDefault()
        installEvent = event
        canInstall = true
        disabled = false
    }

    onMount(() => {
        if ("BeforeInstallPromptEvent" in window === false) return
        canInstall = true
        window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt)
        window.addEventListener("appinstalled", onInstall)
        return () => {
            window.removeEventListener(
                "beforeinstallprompt",
                onBeforeInstallPrompt,
            )
            window.removeEventListener("appinstalled", onInstall)
        }
    })

    const onclick = async () => {
        if (!installEvent) return
        installEvent.prompt()
        const result = await installEvent.userChoice
        if (result.outcome === "accepted") onInstall()
    }
</script>

{#if !disabled && canInstall}
<svelte:element
    this={tag}
    class="install-button"
>
    {@render children(onclick)}
</svelte:element>
{/if}

<style>
    @media (display-mode: standalone) {
        .install-button {
            @apply hidden
        }
    }
</style>
