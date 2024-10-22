<script module lang="ts">
    const KEY = Symbol()
    export const useRadio = () => getContext<{value: string}>(KEY)
</script>

<script>
    import { getContext, setContext, type Snippet } from "svelte"

    let { value = $bindable(), children }: {value?: string, children?: Snippet} = $props()
    setContext(KEY, {
        get value() {
            return value
        },
        set value(v) {
            value = v
        },
    })
</script>

<div class="flex items-center justify-center gap-1">{@render children?.()}</div>