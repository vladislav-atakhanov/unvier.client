<script lang="ts">
    import Button from "./ui/button/button.svelte"
    import * as Drawer from "./ui/drawer"
    import { Trash } from "lucide-svelte"

    let {
        onopen,
        onclose,
    }: { onopen?: () => unknown; onclose?: () => unknown } = $props()

    let isOpen = $state(false)

    let title_ = $state("")
    let value = $state("")

    let resolve: (value: string) => unknown

    export function open(text = "", title = "") {
        onopen?.()
        value = text
        title_ = title
        isOpen = true
        setTimeout(() => textarea.focus(), 100)
        return new Promise<string>((r) => (resolve = r))
    }
    export function close() {
        onclose?.()
        resolve(value)
    }

    const onsubmit = (event: SubmitEvent) => {
        event.preventDefault()
        isOpen = false
        close()
    }
    let textarea: HTMLTextAreaElement

    const clear = () => (value = "")
</script>

<Drawer.Root onClose={close} bind:open={isOpen} shouldScaleBackground={false}>
    <Drawer.Content class="mx-auto w-[90%] max-w-md">
        <Drawer.Header class="px-4 pb-2">
            <Drawer.Title
                class="text-balance text-left grid grid-cols-[1fr_min-content] gap-4"
            >
                <div class="relative w-full">
                    <h2
                        class="text-base font-bold whitespace-nowrap text-ellipsis absolute w-full top-1/2 block overflow-hidden"
                        style:transform="translateY(-50%)"
                    >
                        {title_}
                    </h2>
                </div>
                <Button
                    size="icon"
                    variant="ghost"
                    onclick={clear}
                    disabled={value.length < 1}
                >
                    <Trash />
                </Button>
            </Drawer.Title>
        </Drawer.Header>
        <form {onsubmit}>
            <textarea
                bind:value
                bind:this={textarea}
                class="bg-transparent w-full resize-none block border-[none] h-[70vh] px-4 focus-visible:outline-none"
            ></textarea>
        </form>
    </Drawer.Content>
</Drawer.Root>
