import { _, i18n } from "$lib/i18n"
import { sleep } from "$lib/utils"
import { api } from "./config"
import { HTTPError, Unauthorized } from "./errors"
import { secureStorage } from "./secure-storage"
import { singleFetch } from "./utils"

interface User {
    username: string
    password: string
    univer: string
}

export const checkAuth = () => secureStorage.getItem("password") !== null

const authFetchUrl = (apiUrl: string) => {
    const url = new URL(apiUrl)
    url.searchParams.set("lang", i18n.language)
    return url
}
export const authFetch = async <T>(
    url: string,
    reader?: (r: Response) => unknown
): Promise<T> => {
    while (1) {
        const [data, status] = await singleFetch<T>(
            authFetchUrl(url),
            { credentials: "include" },
            reader
        )
        if (data) return data
        if (status === 401) {
            await sleep(1000)
            const status = await refreshToken()
            if (status === 401) throw new Unauthorized()
            continue
        }
        if (status === 403) throw new Unauthorized()
        throw HTTPError(status)
    }
    throw HTTPError(404)
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
