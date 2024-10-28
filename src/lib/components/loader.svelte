<script>
    import { _ } from "$lib/i18n"
    import { LoaderCircle } from "lucide-svelte"

    let { class: class_ = "" } = $props()
</script>

<div class="flex gap-2 {class_}">
    <LoaderCircle class="animate-spin" />
    {_("loading")}
</div>
