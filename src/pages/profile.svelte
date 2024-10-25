<script>
    import { fetchTranscript, logout } from "$api"
    import AppBar from "$lib/components/app-bar.svelte"
    import Loader from "$lib/components/loader.svelte"
    import * as AlertDialog from "$lib/components/ui/alert-dialog"
    import Button from "$lib/components/ui/button/button.svelte"
    import { _, i18n } from "$lib/i18n"

    import Page from "$lib/layouts/page.svelte"
    import { onMount } from "svelte"
    import { useApp } from "../app.svelte"

    const app = useApp()

    let username = $state("")
    onMount(() => {
        username = localStorage.getItem("username") ?? ""
    })

    let promise = $derived(app.query(() => fetchTranscript(i18n.language)))

    const onLogoutClick = () => app.logout()
</script>
<Page class="grid grid-rows-min-auto">
    {#snippet header()}
        <AppBar title={_("profile")} />
    {/snippet}

    <div class="grid grid-rows-auto-min mx-auto p-4 max-w-xl">
        <div class="flex flex-col gap-4">
            {#await promise}
                <Loader />
            {:then {fullname, education_program}}
                <div>
                    <p class="font-bold">{fullname}</p>
                    <p>{education_program}</p>
                </div>
            {/await}
            <p>{_("username")}: <b>{username}</b></p>

            {#await promise}
                <Loader />
            {:then {year_of_study, length_of_program, language, graid_point, avarage_point}}
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
            {/await}
        </div>
        <AlertDialog.Root>
            <AlertDialog.Trigger let:builder><Button class="w-full" builders={[builder]}>{_("logout")}</Button></AlertDialog.Trigger>
            <AlertDialog.Content>
              <AlertDialog.Header>
                <AlertDialog.Title>{_("logout.sure")}</AlertDialog.Title>
                <AlertDialog.Description>
                    {_("logout.message")}
                </AlertDialog.Description>
              </AlertDialog.Header>
              <AlertDialog.Footer>
                <AlertDialog.Cancel onclick={onLogoutClick}>
                    {_("logout")}
                </AlertDialog.Cancel>
                <AlertDialog.Action>
                    {_("cancel")}
                </AlertDialog.Action>
              </AlertDialog.Footer>
            </AlertDialog.Content>
          </AlertDialog.Root>
    </div>
</Page>