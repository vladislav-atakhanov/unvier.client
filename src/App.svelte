<script>
import { isAuth } from "./api"
import Login from "./pages/login.svelte"
import Attestation from "./pages/attestation.svelte"
</script>

{#if $isAuth}
<Attestation />
{:else}
<Login />
{/if}