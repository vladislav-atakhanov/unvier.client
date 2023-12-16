<script>
    import { MaterialApp, Route } from "material/components"
    import { navigate } from "material"
    import Login from "./pages/login.svelte"
    import Attestation from "./pages/attestation.svelte"
    import Schedule from "./pages/schedule.svelte"
    import Profile from "./pages/profile.svelte"
    import Exams from "./pages/exams.svelte"
    import Calculator from "./pages/calculator.svelte"
    import { onMount } from "svelte"
    import { checkAuth, refreshToken } from "./api"
    import {
        LOGIN,
        ATTESTATION,
        SCHEDULE,
        HOME,
        EXAMS,
        PROFILE,
        PATHS,
        CALCULATOR,
    } from "./url"

    onMount(async () => {
        const { pathname } = location
        const authPath = PATHS.includes(pathname) ? pathname : HOME
        localStorage.setItem("mount-time", `${Date.now()}`)
        navigate(LOGIN)
        const isAuth = await checkAuth()
        if (isAuth) return navigate(authPath)
        navigate(LOGIN)
        if ((await refreshToken()) === 200) return navigate(authPath)
    })

    /** @param {string} location */
    const canBack = (location) => {
        const { pathname } = new URL(location)
        const match = pathname.match(/\//g) || []
        return match.length > 1
    }

    /** @param {string} location */
    const back = (location) => {
        const target = location.split("/").slice(0, -1).join("/")
        navigate(target)
    }
</script>

<MaterialApp {canBack} {back}>
    <Route path={LOGIN} component={Login} />
    <Route path={ATTESTATION} component={Attestation} />
    <Route path={SCHEDULE} component={Schedule} />
    <Route path={PROFILE} component={Profile} />
    <Route path={EXAMS} component={Exams} />
    <Route path={CALCULATOR} component={Calculator} />
</MaterialApp>
