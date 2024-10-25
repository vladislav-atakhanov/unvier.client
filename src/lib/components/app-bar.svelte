<script lang="ts">
    import { useRouter } from "$lib/router"
    import { Button } from "$lib/components/ui/button"
    import { ArrowLeft, Menu, X } from "lucide-svelte"
    import { Separator } from "$lib/components/ui/separator"
    import type { Snippet } from "svelte"
    import { useApp } from "../../app.svelte"

    const router = useRouter()
    const { title, left, right, onTitleClick }: {title?: Snippet | string, left?: Snippet, right?: Snippet, onTitleClick?: (title: string) => unknown} = $props()

    let canBack = $state(false)
    let element: HTMLElement
    $effect(() => {
        const page = element.closest(".page")
        const pages = page?.parentElement?.querySelectorAll(".page") ?? []
        const index = Array.from(pages).findIndex((p) => p === page)
        canBack = index !== 0
    })

    const app = useApp()

    const onTitleElementClick = onTitleClick ? (event: any) => {
        const title = (event.target as HTMLElement)?.closest("h1")
        if (!title?.textContent) return
        onTitleClick?.(title.textContent)
    } : undefined
</script>

<header class="" bind:this={element}>
    <div class="grid items-center gap-2 p-2 h-14">

        <div>
            {#if canBack}
                <Button size="icon" variant="ghost" onclick={() => router.back()}>
                    <ArrowLeft />
                </Button>
            {:else if app.drawer}
            <Button size="icon" variant="ghost" onclick={() => app.toggleDrawer()}>
                {#if app.drawerState === "close"}
                    <Menu />
                {:else}
                    <X />
                {/if}
            </Button>
            {/if}
            {@render left?.()}
        </div>
        <div class="relative w-full">
            {#if title}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
                <h1 class="text-xl font-bold whitespace-nowrap text-ellipsis absolute w-full top-0 block overflow-hidden" onclick={onTitleElementClick}>
                    {#if typeof title === "string"}
                        {title}
                    {:else}
                        {@render title()}
                    {/if}
                </h1>
            {/if}
        </div>

        <div>{@render right?.()}</div>
    </div>
    <Separator />
</header>
<style>
    .relative::before {
        content: "0";
        color: transparent;
        pointer-events: none;
    }
    .grid {
        grid-template-columns: min-content 1fr min-content;
    }
</style>