import { api } from "./config"
import { HOME, LOGIN } from "../url"
import { navigate } from "material"
import { TOKEN_KEY } from "./storage-keys"
import { storage } from "./storage"
import { singleFetch } from "./utils"
import { alert } from "material/notificator"
import { localStorageKeys } from "material"
import { getLanguage, i18n } from "material/i18n"

const _ = i18n(undefined, false)

export const authFetch = async <T>(url: string): Promise<T | null> => {
    while (1) {
        const accessToken = await getToken()
        const queryString = new URLSearchParams({
            token: accessToken || "",
            lang: getLanguage(),
        }).toString()
        const [data, status] = await singleFetch<T>(`${url}?${queryString}`)
        if (status === 200) return data
        if (status === 401) {
            const status = await refreshToken()
            if (status === 401) {
                navigate(LOGIN)
                return null
            }
            continue
        }
        if (status === 404 || status >= 500 || status < 600)
            alert(_("error.server-error"))
        else if (status === 408) alert(_("error.univer-error"))
        else alert(_("error.unknown-error", status))
        return null
    }
    return null
}

const setToken = async (token: string) => {
    localStorage.setItem(TOKEN_KEY, token)
    navigate(HOME)
}

export const getToken = async () => localStorage.getItem(TOKEN_KEY)
export const checkAuth = async () => (await getToken()) !== null

export const refreshToken = async () => {
    const [accessToken, status] = await singleFetch<string>(
        api("/auth/refresh"),
        {
            method: "GET",
            credentials: "include",
        }
    )
    if (accessToken) await setToken(accessToken)
    return status
}
export const login = async (
    username: string,
    password: string,
    lang: string
) => {
    const [accessToken, status] = await singleFetch<string>(
        api("/auth/login"),
        {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({ username, password }),
        }
    )
    if (accessToken) await setToken(accessToken)
    return status
}

const whitelist = ["username", TOKEN_KEY, ...localStorageKeys]

export const logout = () => {
    storage.clear()
    for (const key in localStorage) {
        if (whitelist.includes(key)) continue
        localStorage.removeItem(key)
    }
    localStorage.removeItem(TOKEN_KEY)
    fetch(api("/auth/logout"), {
        method: "GET",
        credentials: "include",
    })
}
