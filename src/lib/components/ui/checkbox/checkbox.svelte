<script lang="ts">
    import Check from "lucide-svelte/icons/check"
    import Minus from "lucide-svelte/icons/minus"
    import type { HTMLInputAttributes } from "svelte/elements"

    let {
        class: class_,
        checked = $bindable(false),
        ...props
    }: HTMLInputAttributes & { class?: string; checked?: boolean } = $props()
</script>

<input type="checkbox" class="sr-only" bind:checked {...props} />
<span
    class="{class_} body border-primary ring-offset-background peer box-content h-4 w-4 shrink-0 rounded-sm border"
>
    <span class="icon flex h-4 w-4 items-center justify-center text-current">
        <Check class="check h-3.5 w-3.5" />
        <Minus class="minus h-3.5 w-3.5" />
    </span>
</span>

<style>
    input:focus-visible + .body {
        @apply ring-ring outline-none ring-2 ring-offset-2;
    }
    input:disabled + .body {
        @apply cursor-not-allowed opacity-50;
    }

    input:focus-visible + .body {
        @apply ring-ring outline-none ring-2 ring-offset-2;
    }

    input:checked + .body {
        @apply bg-primary text-primary-foreground;
    }

    .body :global(.check),
    .body :global(.minus) {
        display: none;
    }
    input:indeterminate + .body :global(.minus) {
        display: block;
    }
    input:checked + .body :global(.check) {
        display: block;
    }
</style>
