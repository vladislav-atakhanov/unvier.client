<script lang="ts">
    import { version } from "$api"
    import AppBar from "$lib/components/app-bar.svelte"
    import { Label } from "$lib/components/ui/label"
    import * as Radio from "$lib/components/ui/segmented-radio"
    import { _, setLocale } from "$lib/i18n"
    import { locales } from "$lib/i18n"
    import { onMount } from "svelte"


    import Page from "../layouts/page.svelte"
    import { routes } from "./url"
    import colorScheme from "$lib/color-scheme"

    let language = $state("ru")

    $effect(() => setLocale(language as any))

    onMount(() => {
        version.fetch()
    })


</script>
<Page>
    {#snippet header()}
        <AppBar title={_("settings")} />
    {/snippet}

    <div class="max-w-xl mx-auto px-4 py-8 space-y-8">


        <Label class="grid gap-2">
            {_("color-scheme")}
            <Radio.Root bind:value={colorScheme.value}>
                <Radio.Item value="light">{_("color-scheme.light")}</Radio.Item>
                <Radio.Item value="auto">{_("color-scheme.auto")}</Radio.Item>
                <Radio.Item value="dark">{_("color-scheme.dark")}</Radio.Item>
            </Radio.Root>
        </Label>
        <Label class="grid gap-2">
            {_("language")}
            <Radio.Root bind:value={language}>
                {#each Object.entries(locales) as [value, locale]}
                <Radio.Item {value}>{locale.CURRENT_LANGUAGE}</Radio.Item>
                {/each}
            </Radio.Root>
        </Label>

        <div>
            <p>
                {_("version.server")}:
                {#if version.loading}
                {_("loading")}
                {:else}
                <b>{version.server}</b>
                {/if}
            </p>
            <p>{_("version.client")}: <b>{version.client}</b></p>
            {#if version.update}
                <p class="text-destructive text-center">{_("version.update-required")}</p>
            {/if}
        </div>

        <a class="text-primary" href={routes.privacy}>{@html _("privacy-policy", routes.privacy)}</a>
    </div>
</Page>