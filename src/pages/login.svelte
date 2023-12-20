<script>
    import {
        TextField,
        FilledButton,
        Scaffold,
        AppBar,
        IconButton,
    } from "material/components"
    import { login } from "../api"
    import { onMount } from "svelte"
    import WriteMe from "../components/write-me.svelte"
    import { SETTINGS } from "../url"
    import { i18n } from "material/i18n"
    import { updateAllStores } from "../api/data"
    const _ = i18n()
    let username = ""
    let password = ""
    let error = ""

    let sent = false

    const onSubmit = async () => {
        if (sent) return
        error = ""
        sent = true
        const status = await login(username, password)
        sent = false
        if (status === 200) {
            localStorage.setItem("username", username)
            setTimeout(updateAllStores, 1000)
            return
        }
        if (status === 401) {
            error = _("error.invalid-credentials")
            return
        }
        error = _("error.connection-error")
    }

    onMount(() => {
        const localUsername = localStorage.getItem("username")
        if (username.length < 1 && localUsername) username = localUsername
    })

    $: active = username.length && password.length
    $: disabled = sent ? true : !active
</script>

<Scaffold>
    <AppBar slot="app-bar">
        <div class="login__actions" slot="actions">
            <WriteMe />
            <IconButton icon="settings" href={SETTINGS} />
        </div>
    </AppBar>
    <div class="login__container">
        <form on:submit|preventDefault={onSubmit}>
            <TextField label={_("username")} bind:value={username} />
            <TextField
                label={_("password")}
                bind:value={password}
                type="password"
            />
            {#if error}
                <p class="error">{error}</p>
            {/if}
            <FilledButton type="submit" {disabled}
                >{sent ? _("loading") : _("login")}</FilledButton
            >
        </form>
    </div>
</Scaffold>

<style>
    :global(md-filled-button) {
        display: block;
    }
    .login__container {
        margin: 0 auto;
        max-width: 500px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        height: 100%;
    }
    .login__actions {
        display: flex;
        gap: 0.5em;
        font-size: 2em;
        align-items: center;
    }
    form {
        display: grid;
        gap: 1em;
    }
    .error {
        margin: 0;
        color: var(--md-sys-color-error);
    }
</style>
