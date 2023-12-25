<script>
    import {
        Scaffold,
        AppBar,
        FilledButton,
        IconButton,
    } from "material/components"
    import { logout, useTranscript } from "../api"
    import Navigation from "../components/navigation.svelte"
    import { onMount } from "svelte"
    import { LOGIN, SETTINGS } from "../url"
    import { navigate } from "material"

    import { i18n } from "material/i18n"
    import LoadingText from "../components/loading-text.svelte"
    const _ = i18n()

    let username = ""
    onMount(() => {
        username = localStorage.getItem("username") || ""
    })

    const [transcript, loading] = useTranscript()

    const onClick = () => {
        logout()
        navigate(LOGIN)
    }
</script>

<Scaffold>
    <AppBar slot="app-bar"
        ><LoadingText {loading}>{_("profile")}</LoadingText>
        <IconButton slot="actions" icon="settings" href={SETTINGS} />
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
        <FilledButton on:click={onClick}>{_("logout")}</FilledButton>
    </div>

    <Navigation slot="navigation-bar" />
</Scaffold>

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
