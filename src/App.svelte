<script>
    import { MaterialApp, Route } from "material/components"
    import { navigate } from "material"
    import Login from "./pages/login.svelte"
    import Attestation from "./pages/attestation.svelte"
    import Schedule from "./pages/schedule.svelte"
    import Profile from "./pages/profile.svelte"
    import Exams from "./pages/exams.svelte"
    import { onMount } from "svelte"
    import { isAuth } from "./api"
    import {
        LOGIN,
        ATTESTATION,
        SCHEDULE,
        HOME,
        EXAMS,
        PROFILE,
        PATHS,
    } from "./url"

    onMount(() => {
        const { pathname } = location
        const authPath = PATHS.includes(pathname) ? pathname : HOME
        navigate(isAuth() ? authPath : LOGIN)
    })

    /** @param {string} location */
    const canBack = (location) => {
        const { pathname } = new URL(location)
        const match = pathname.match(/\//g) || []
        return match.length > 1
    }
</script>

<MaterialApp {canBack}>
    <Route path={LOGIN} component={Login} />
    <Route path={ATTESTATION} component={Attestation} />
    <Route path={SCHEDULE} component={Schedule} />
    <Route path={PROFILE} component={Profile} />
    <Route path={EXAMS} component={Exams} />
</MaterialApp>
