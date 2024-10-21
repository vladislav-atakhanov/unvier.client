import { Routes, type Middleware } from "$lib/router"
import { checkAuth } from "../api"
import Login from "./login.svelte"
import Privacy from "./privacy.svelte"
import Settings from "./settings.svelte"

export const ATTESTATION = "/attestation"
export const LOGIN = "/login"
export const SCHEDULE = "/schedule"
export const PROFILE = "/profile"
export const EXAMS = "/schedule/exams"
export const CALCULATOR = "/attestation/calculator"
export const SETTINGS = "/settings"
export const PRIVACY_POLICY = "/privacy"
export const TELEGRAM = "https://t.me/univerapp"
export const UMKD = "/umkd"
export const FAQ = "/faq"

export const HOME = SCHEDULE

const authMiddleware: Middleware = ({ render, navigate }) => {
    if (checkAuth()) return render()
    navigate(routes.login, { mode: "replace" })
}

export const routes = Routes({
    attestation: {
        component: Login,
        path: "/attestation",
        middleware: authMiddleware,
    },

    login: {
        component: Login,
        path: "/login",
    },
    settings: {
        component: Settings,
        path: "/settings",
    },
    faq: {
        component: Login,
        path: "/faq",
    },
    privacy: {
        component: Privacy,
        path: "/privacy",
    },
    get home() {
        return this.attestation
    },
})

export const route = (key: keyof typeof routes) => routes[key].path
