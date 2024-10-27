<script lang="ts">
    import type { HTMLInputAttributes } from "svelte/elements"

    let {
        checked = $bindable(false),
        class: class_ = "",
        ...props
    }: HTMLInputAttributes = $props()
</script>

<div class="relative w-max {class_}">
    <input
        type="checkbox"
        class="absolute inset-0 appearance-none opacity-[0.01]"
        bind:checked
        {...props}
    />
    <span
        class="peer flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors
        before:bg-background before:pointer-events-none before:block before:h-5 before:w-5 before:rounded-full before:shadow-lg before:ring-0 before:transition-transform
        "
    ></span>
</div>

<style>
    input:disabled + span {
        @apply cursor-not-allowed opacity-50;
    }
    input:focus-visible + span {
        @apply ring-ring ring-offset-background outline-none ring-2 ring-offset-2;
    }
    input:not(:checked) + span {
        @apply bg-input before:translate-x-0;
    }
    input:checked + span {
        @apply bg-primary before:translate-x-5;
    }
</style>
