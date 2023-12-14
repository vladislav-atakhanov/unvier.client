<script>
    import { MaterialApp, Route } from "material/components"
    import { navigate } from "material"
    import Login from "./pages/login.svelte"
    import Attestation from "./pages/attestation.svelte"
    import Schedule from "./pages/schedule.svelte"
    import Profile from "./pages/profile.svelte"
    import { onMount } from "svelte"
    import { isAuth } from "./api"
    import { LOGIN, ATTESTATION, SCHEDULE, HOME, PROFILE } from "./url"

    onMount(() => {
        if (isAuth()) {
            navigate(HOME)
        }
    })
</script>

<MaterialApp home={LOGIN}>
    <Route path={LOGIN} component={Login} />
    <Route path={ATTESTATION} component={Attestation} />
    <Route path={SCHEDULE} component={Schedule} />
    <Route path={PROFILE} component={Profile} />
</MaterialApp>
