<script lang="ts">
    import { useRouter } from "$lib/router"
    import { Button } from "$lib/components/ui/button"
    import { ArrowLeft } from "lucide-svelte"
    import { Separator } from "$lib/components/ui/separator"
    import { type Snippet } from "svelte"

    const router = useRouter()
    const { title, left, right }: {title?: Snippet | string, left?: Snippet, right?: Snippet} = $props()

    let canBack = $state(false)
    let element: HTMLElement
    $effect(() => {
        const page = element.closest(".page")
        const pages = page?.parentElement?.querySelectorAll(".page") ?? []
        const index = Array.from(pages).findIndex((p) => p === page)
        canBack = index !== 0
    })
</script>

<header class="" bind:this={element}>
    <div class="flex items-center gap-2 p-2 h-14">
        {#if canBack}
            <Button size="icon" variant="ghost" onclick={() => router.back()}>
                <ArrowLeft />
            </Button>
        {/if}
        {@render left?.()}
        {#if title}
            <h1 class="text-xl font-bold">
                {#if typeof title === "string"}
                    {title}
                {:else}
                    {@render title()}
                {/if}
            </h1>
        {/if}

        {#if right}
            <div class="ml-auto">{@render right()}</div>
        {/if}
    </div>
    <Separator />
</header>
