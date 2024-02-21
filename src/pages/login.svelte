<script>
    import {
        TextField,
        FilledButton,
        Scaffold,
        AppBar,
        IconButton,
        Icon,
        SegmentedButtons,
        Checkbox,
    } from "material/components"
    import { navigate } from "material"
    import { login } from "../api"
    import { onMount } from "svelte"
    import WriteMe from "../components/write-me.svelte"
    import { PRIVACY_POLICY, SETTINGS, HOME, FAQ } from "../url"
    import { i18n } from "material/i18n"
    import { updateAllStores } from "../api/data"
    import Version from "../components/version.svelte"
    import InstallButton from "../components/install-button.svelte"

    const _ = i18n()
    let username = ""
    let password = ""
    let error = ""
    const univers = ["KSTU", "KazNU"]
    let univer = "KSTU"

    let sent = false

    const onSubmit = async () => {
        if (disabled) return
        error = ""
        sent = true
        const status = await login({
            username,
            password,
            univer: univer.toLowerCase(),
        })
        navigate(HOME)
        sent = false
        if (status === 200) {
            localStorage.setItem("username", username)
            localStorage.setItem("univer", univer)
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

        const localUniver = localStorage.getItem("univer")
        if (localUniver) univer = localUniver
    })

    let agree = false

    $: active = agree && username.length && password.length
    $: disabled = sent ? true : !active
</script>

<Scaffold>
    <AppBar slot="app-bar" icon={false}>
        <IconButton href={FAQ} icon="help" slot="leading" />
        <div class="login__actions" slot="actions">
            <InstallButton class="login__install">
                <Icon slot="mobile" name="install_mobile" />
                <Icon slot="desktop" name="install_desktop" />
            </InstallButton>
            <WriteMe />
            <IconButton icon="settings" href={SETTINGS} />
        </div>
    </AppBar>
    <div class="login__container">
        <form on:submit|preventDefault={onSubmit}>
            <SegmentedButtons bind:value={univer} items={univers} />
            <TextField label={_("username")} bind:value={username} />
            <TextField
                label={_("password")}
                bind:value={password}
                type="password"
            />
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label class="policy">
                <Checkbox label={false} bind:checked={agree} />
                <span>
                    {@html _("privacy-policy.agree", PRIVACY_POLICY)}
                </span>
            </label>
            {#if error}
                <p class="error">{error}</p>
            {/if}
            <FilledButton type="submit" {disabled}
                >{sent ? _("loading") : _("login")}</FilledButton
            >
        </form>
        <div class="login__version">
            <Version />
        </div>
    </div>
</Scaffold>

<style>
    :global(md-filled-button) {
        display: block;
    }
    label {
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
        --width: 100%;
    }
    .login__version {
        position: absolute;
        bottom: 0;
        opacity: 0.5;
    }
    .policy {
        display: flex;
        gap: 1em;
        align-items: center;
    }
    .policy span {
        font-size: 0.8em;
    }
    .policy :global(a) {
        color: var(--md-sys-color-primary);
    }
    .login__actions {
        display: flex;
        gap: 0.5em;
        font-size: 2em;
        align-items: center;
    }
    :global(.login__install) {
        padding: 0.5em;
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
