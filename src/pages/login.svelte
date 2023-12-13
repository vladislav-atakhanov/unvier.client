<script>
	import { login, refreshToken } from "../api"
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
        if (username.length < 1 && localUsername)
            username = localUsername
    })


	$: active = username.length && password.length
    $: disabled = sent ? true : !active
</script>

<div class="container login__container">
	<form on:submit|preventDefault={onSubmit}>
		<label>
			Логин
			<input type="text" bind:value={username} />
		</label>
		<label>
			Пароль
			<input type="password" bind:value={password} />
		</label>
		{#if error}
			<p class="error">{error}</p>
		{/if}
		<button type="submit" {disabled}>Войти</button>
	</form>
</div>

<style>
	.login__container {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
	}
	label, input, button {
		display: block;
		width: 100%
	}
	form {
		display: grid;
		gap: 1em
	}
	.error {
		margin: 0;
		color: red;
	}
</style>