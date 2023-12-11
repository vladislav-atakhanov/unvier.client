<script>
	import { login, refreshToken } from "../api"
	let username = "atakhanov.vladislav"
	let password = ""
	let error = ""

	const onSubmit = async () => {
		try {
			await login(username, password)
		} catch (e) {
			error = "Неверный логин или пароль"
		} finally {
			// username = ""
			// password = ""
		}
	}

	$: active = username.length && password.length
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
		<button type="submit" disabled={!active}>Войти</button>
	</form>
    <button type="" on:click={refreshToken}>Войти</button>
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