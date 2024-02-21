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
        PRIVACY_POLICY,
        UMKD,
        FAQ,
    } from "./url"
    import Attendance from "./pages/attendance.svelte"
    import Settings from "./pages/settings.svelte"
    import i18n from "./i18n"
    import PrivacyPolicy from "./pages/privacy-policy.svelte"
    import Drawer from "./components/drawer.svelte"
    import Umkd from "./pages/umkd.svelte"
    import UmkdFiles from "./pages/umkd-files.svelte"
    import Faq from "./pages/faq.svelte"
    import FaqFile from "./pages/faq-file.svelte"

    let currentPath = "/"
    onMount(async () => {
        const { pathname } = location
        currentPath = pathname
        const authPath = AUTH_PATHS.includes(pathname) ? pathname : HOME
        localStorage.setItem("mount-time", `${Date.now()}`)
        if (checkAuth()) return navigate(authPath)
        navigate(LOGIN)
        if ((await refreshToken()) === 200) return navigate(authPath)
    })

    /** @param {string} location */
    const canBack = (location) => {
        const { pathname } = new URL(location)
        const match = pathname.match(/\//g) || []
        return match.length > 1
    }

    const home = () => (checkAuth() ? HOME : LOGIN)
</script>

<MaterialApp {canBack} {i18n} defaultLanguage="ru" {home}>
    <Route path={LOGIN} component={Login} />
    <Route path={ATTESTATION} component={Attestation} />
    <Route path="{ATTESTATION}/:subject" component={Attendance} />
    <Route path={SCHEDULE} component={Schedule} />
    <Route path="/" component={Schedule} />
    <Route path={PROFILE} component={Profile} />
    <Route path={EXAMS} component={Exams} />
    <Route path={CALCULATOR} component={Calculator} />
    <Route path={PRIVACY_POLICY} component={PrivacyPolicy} />
    <Route path={UMKD} component={Umkd} />
    <Route path="{UMKD}/:id" component={UmkdFiles} />
    <Route path={SETTINGS} component={Settings} />
    <Route path={FAQ} component={Faq} />
    <Route path="{FAQ}/:id" component={FaqFile} />
    <Drawer slot="drawer" />
</MaterialApp>
