<script>
    import {
        Scaffold,
        AppBar,
        FilledButton,
        Popup,
        TextButton,
    } from "material/components"
    import { logout, useTranscript } from "../api"
    import Navigation from "../components/navigation.svelte"
    import { onMount } from "svelte"

    import { i18n } from "material/i18n"
    import LoadingText from "../components/loading-text.svelte"
    const _ = i18n()

    let username = ""
    onMount(() => {
        username = localStorage.getItem("username") || ""
    })

    const [transcript, loading] = useTranscript()

    /** @type {Popup} */
    let popup

    const onLogout = () => {
        popup.close()
        logout()
    }
</script>

<Scaffold>
    <AppBar slot="app-bar"
        ><LoadingText {loading}>{_("profile")}</LoadingText>
    </AppBar>
    <div class="profile__container">
        <div class="profile__content">
            {#if $transcript}
                <div>
                    <p>{$transcript.fullname}</p>
                    <p>{$transcript.education_program}</p>
                </div>
            {/if}
            <p>{_("username")}: <b>{username}</b></p>

            {#if $transcript}
                <div>
                    <p class="profile__year">
                        {_("transcript.year-of-study")}:
                        <b>{$transcript.year_of_study}</b>
                        <span>/ {$transcript.length_of_program}</span>
                    </p>
                    <p>
                        {_("transcript.language")}:
                        <b>{$transcript.language}</b>
                    </p>
                </div>
                <div>
                    <p>
                        {_("transcript.graid-point")}:
                        <b>{$transcript.graid_point}</b>
                    </p>
                    <p>
                        {_("transcript.avarage-point")}:
                        <b>{$transcript.avarage_point}</b>
                    </p>
                </div>
            {/if}
        </div>
        <FilledButton onclick={() => popup.open()}>{_("logout")}</FilledButton>
    </div>

    <Navigation slot="navigation-bar" />
</Scaffold>

<Popup bind:this={popup}>
    <svelte:fragment slot="title">{_("logout.sure")}</svelte:fragment>
    {_("logout.message")}
    <svelte:fragment slot="actions">
        <TextButton onclick={onLogout}>{_("logout")}</TextButton>
        <TextButton onclick={() => popup.close()}>{_("cancel")}</TextButton>
    </svelte:fragment>
</Popup>

<style>
    :global(md-filled-button) {
        display: block;
    }
    .profile__year span {
        opacity: 0.5;
    }
    .profile__container {
        margin: 0 auto;
        max-width: 500px;
        display: grid;
        grid-template-rows: 1fr max-content;
        height: 100%;
        padding-bottom: 1em;
    }
    .profile__content {
        display: flex;
        gap: 1em;
        flex-direction: column;
    }
    p {
        margin: 0;
    }
</style>
