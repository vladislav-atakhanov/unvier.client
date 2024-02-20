<script lang="ts">
    import { onMount } from "svelte"
    import { i18n } from "material/i18n"
    interface BeforeInstallPromptEvent {
        prompt: () => void
        userChoice: Promise<{ outcome: "accepted" }>
    }

    const _ = i18n()
    let canInstall = false
    let disabled = true
    let installEvent: BeforeInstallPromptEvent | null = null

    let class_ = ""
    export { class_ as class }

    export let tag = "div"

    const onInstall = () => {
        canInstall = false
        installEvent = null
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

    const onClick = async () => {
        if (!installEvent) return
        installEvent.prompt()
        const result = await installEvent.userChoice
        if (result.outcome === "accepted") onInstall()
    }
</script>

<svelte:element
    this={tag}
    class="install-button"
    class:install-button--can-install={canInstall && !disabled}
>
    <button class="button {class_}" on:click={onClick} {disabled}>
        <div class="mobile"><slot name="mobile" /></div>
        <div class="desktop"><slot name="desktop" /></div>
    </button>
</svelte:element>

<style>
    .install-button {
        display: none;
    }
    .install-button--can-install {
        display: block;
    }
    @media (display-mode: standalone) {
        .install-button {
            display: none;
        }
    }
    .button {
        border: none;
        padding: 0;
        margin: 0;
        background-color: transparent;
        width: 100%;
        font: inherit;
        line-height: unset;
        color: inherit;
    }
    .button:disabled {
        opacity: 0.5;
        pointer-events: none;
    }

    @media (width >= 900px) {
        .mobile {
            display: none;
        }
        .desktop {
            display: block;
        }
    }
    @media (width < 900px) {
        .mobile {
            display: block;
        }
        .desktop {
            display: none;
        }
    }
</style>
