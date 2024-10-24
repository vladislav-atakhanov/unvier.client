<script>
    import { _ } from "$lib/i18n"
    import { LoaderCircle } from "lucide-svelte"
</script>

<div class="flex gap-2">
    <LoaderCircle class="animate-spin" />
    {_("loading")}
</div>
