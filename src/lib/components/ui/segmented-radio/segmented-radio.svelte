<script module lang="ts">
    const KEY = Symbol()
    export const useRadio = () => getContext<{value: string, name: string}>(KEY)
</script>

<script>
    import { getContext, setContext, type Snippet } from "svelte"

    let { value = $bindable(), children, name }: {value?: string, children?: Snippet, name?: string} = $props()
    setContext(KEY, {
        get value() {
            return value
        },
        set value(v) {
            value = v
        },
        get name() {
            return name
        }
    })
</script>

<div class="flex items-center justify-center gap-1">{@render children?.()}</div>