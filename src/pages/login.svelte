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
            return
        }
        if (status === 401) {
            error = "Неверный логин или пароль"
            return
        }
        error = "Ошибка соединения"
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
            <TextField label="Логин" bind:value={username} />
            <TextField label="Пароль" bind:value={password} type="password" />
            {#if error}
                <p class="error">{error}</p>
            {/if}
            <FilledButton type="submit" {disabled}
                >{sent ? "Загрузка..." : "Войти"}</FilledButton
            >
        </form>
    </div>
</Scaffold>

<style>
    :global(md-filled-button) {
        display: block;
    }
    .login__write-me {
        font-size: 2em;
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
    .login__write-me {
        position: absolute;
        top: 0;
        right: 0;
        padding: 0.5em;
        font-size: 2em;
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
