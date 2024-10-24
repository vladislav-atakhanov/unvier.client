import { _, i18n } from "$lib/i18n"
import { api } from "./config"
import { secureStorage } from "./secure-storage"
import { singleFetch, sleep } from "./utils"

interface User {
    username: string
    password: string
    univer: string
}

export const checkAuth = () => secureStorage.getItem("password") !== null

const authFetchUrl = (apiUrl: string) => {
    const url = new URL(apiUrl)
    url.searchParams.append("lang", i18n.language)
    return url
}
const addSnack = console.log

export const authFetch = async <T>(
    url: string,
    reader?: (r: Response) => unknown
): Promise<T | null> => {
    while (1) {
        const [data, status] = await singleFetch<T>(
            authFetchUrl(url),
            { credentials: "include" },
            reader
        )
        if (status === 200) return data
        if (status === 401) {
            await sleep(1000)
            const status = await refreshToken()
            if (status === 401) {
                logout()
                return null
            }
            continue
        }
        if (status === 403) {
            addSnack(_("error.invalid-credentials"))
            logout()
            return null
        }

        if (status === 400) addSnack(_("version.update-required"))
        if (status === 404 || (status >= 500 && status < 600))
            addSnack(_("error.server-error"))
        else if (status === 408) addSnack(_("error.univer-error"))
        else addSnack(_("error.unknown-error", status))
        return null
    }
    return null
}

export const refreshToken = async () => {
    const username = localStorage.getItem("username")
    const univer = localStorage.getItem("univer")
    const password = secureStorage.getItem("password")

    if (username && univer && password)
        return await login({ password, username, univer })
    return 401
}

let loginPromise: Promise<number> | null = null
export const login = (user: User) => {
    if (loginPromise) return loginPromise
    loginPromise = new Promise(async (resolve) => {
        await new Promise((r) => setTimeout(r, 1000))
        try {
            const { status } = await fetch(api("/auth/login"), {
                method: "POST",
                credentials: "include",
                body: JSON.stringify(user),
            })
            if (status === 200) {
                const { password, username, univer } = user
                secureStorage.setItem("password", password)
                localStorage.setItem("username", username)
                localStorage.setItem("univer", univer)
            }
            resolve(status)
        } catch {
            resolve(404)
        }
    })
    loginPromise.then(() => setTimeout(() => (loginPromise = null), 1000))
    return loginPromise
}

export const logout = async () => {
    fetch(api(`/auth/logout`), { credentials: "include" })
    secureStorage.removeItem("password")
}
