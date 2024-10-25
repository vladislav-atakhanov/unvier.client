<script lang="ts">
    import { Toaster, type ToasterProps } from "svelte-sonner"
    import colorScheme from "$lib/color-scheme"

    let props: ToasterProps = $props()
</script>

<Toaster
    theme={colorScheme.value}
    class="toaster group"
    toastOptions={{
        classes: {
            toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
            description: "group-[.toast]:text-muted-foreground",
            actionButton:
                "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
            cancelButton:
                "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
    }}
    {...props}
/>
