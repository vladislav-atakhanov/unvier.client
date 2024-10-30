<script>
    import { useApi } from "$api"
    import AppBar from "$lib/components/app-bar.svelte"
    import Loader from "$lib/components/loader.svelte"
    import * as Drawer from "$lib/components/ui/drawer"
    import Button from "$lib/components/ui/button/button.svelte"
    import { _ } from "$lib/i18n"

    import Page from "$lib/layouts/page.svelte"
    import { onMount } from "svelte"
    import { useApp } from "../app.svelte"

    const app = useApp()
    const api = useApi()

    let username = $state("")
    onMount(() => {
        username = localStorage.getItem("username") ?? ""
    })

    let query = api.fetchTranscript()
    const onLogoutClick = () => app.logout()
</script>
<Page class="grid grid-rows-min-auto">
    {#snippet header()}
        <AppBar title={_("profile")} />
    {/snippet}

    <div class="grid grid-rows-auto-min mx-auto px-2 py-4 max-w-md w-full">
        <div class="flex flex-col gap-4">
            {#if query.loading}
                <Loader />
            {:else if query.data}
                {@const {fullname, education_program} = query.data}
                <div>
                    <p class="font-bold">{fullname}</p>
                    <p>{education_program}</p>
                </div>
            {/if}
            <p>{_("username")}: <b>{username}</b></p>

            {#if query.loading}
                <Loader />
            {:else if query.data}
                {@const {year_of_study, length_of_program, language, graid_point, avarage_point} = query.data}
                <div>
                    <p class="profile__year">
                        {_("transcript.year-of-study")}:
                        <b>{year_of_study}</b>
                        <span class="opacity-50">/ {length_of_program}</span>
                    </p>
                    <p>
                        {_("transcript.language")}:
                        <b>{language}</b>
                    </p>
                </div>
                <div>
                    <p>
                        {_("transcript.graid-point")}:
                        <b>{graid_point}</b>
                    </p>
                    <p>
                        {_("transcript.avarage-point")}:
                        <b>{avarage_point}</b>
                    </p>
                </div>
            {/if}
        </div>
        <Drawer.Root>
            <Drawer.Trigger let:builder>
                <Button class="w-full" builders={[builder]}>{_("logout")}</Button>
            </Drawer.Trigger>
            <Drawer.Content class="mx-auto w-[90%] max-w-sm">
                <Drawer.Header>
                    <Drawer.Title>{_("logout.sure")}</Drawer.Title>
                    <Drawer.Description>
                        {_("logout.message")}
                    </Drawer.Description>
                </Drawer.Header>
                <Drawer.Footer class="flex justify-end flex-row">
                    <Button variant="outline" onclick={onLogoutClick}>
                        {_("logout")}
                    </Button>
                    <Drawer.Close>
                        <Button>{_("cancel")}</Button>
                    </Drawer.Close>
                </Drawer.Footer>
            </Drawer.Content>
        </Drawer.Root>
    </div>
</Page>