<script>
    import { TextField, FilledButton } from "material/components"
    import { login } from "../api"
    import { onMount } from "svelte"
    let username = ""
    let password = ""
    let error = ""

    let sent = false

    const onSubmit = async () => {
        try {
            sent = true
            error = ""
            await login(username, password)
            localStorage.setItem("username", username)
        } catch (e) {
            error = "Неверный логин или пароль"
        } finally {
            sent = false
        }
    }

    onMount(() => {
        const localUsername = localStorage.getItem("username")
        if (username.length < 1 && localUsername) username = localUsername
    })

    $: active = username.length && password.length
    $: disabled = sent ? true : !active
</script>

<div class="container login__container">
    <form on:submit|preventDefault={onSubmit}>
        <TextField label="Логин" bind:value={username} />
        <TextField label="Пароль" bind:value={password} type="password" />
        {#if error}
            <p class="error">{error}</p>
        {/if}
        <FilledButton {disabled}>Войти</FilledButton>
    </form>
</div>

<style>
    .login__container {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
    }
    label,
    input,
    button {
        display: block;
        width: 100%;
    }
    form {
        display: grid;
        gap: 1em;
    }
    .error {
        margin: 0;
        color: red;
    }
</style>
