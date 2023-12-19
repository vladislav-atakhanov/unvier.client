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
        AUTH_PATHS,
        CALCULATOR,
        SETTINGS,
    } from "./url"
    import Attendance from "./pages/attendance.svelte"
    import Settings from "./pages/settings.svelte"
    import i18n from "./i18n"

    let showLogin = false

    let currentPath = "/"
    onMount(async () => {
        const { pathname } = location
        currentPath = pathname
        const authPath = AUTH_PATHS.includes(pathname) ? pathname : HOME
        localStorage.setItem("mount-time", `${Date.now()}`)
        showLogin = true
        const isAuth = await checkAuth()
        showLogin = false
        if (isAuth) return
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
        let target = location.split("/").slice(0, -1).join("/")
        if (target === "/") target = HOME
        navigate(target)
    }
</script>

<MaterialApp {canBack} {back} {i18n}>
    {#if showLogin}
        <Route path={currentPath} component={Login} />
    {:else}
        <Route path={LOGIN} component={Login} />
        <Route path={ATTESTATION} component={Attestation} />
        <Route path="{ATTESTATION}/:subject" component={Attendance} />
        <Route path={SCHEDULE} component={Schedule} />
        <Route path="/" component={Schedule} />
        <Route path={PROFILE} component={Profile} />
        <Route path={EXAMS} component={Exams} />
        <Route path={CALCULATOR} component={Calculator} />
    {/if}
    <Route path={SETTINGS} component={Settings} />
</MaterialApp>
