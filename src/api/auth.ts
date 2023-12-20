import { api } from "./config"
import { HOME, LOGIN } from "../url"
import { navigate } from "material"
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "./storage-keys"
import { storage } from "./storage"
import { singleFetch } from "./utils"
import { alert } from "material/notificator"
import { localStorageKeys } from "material"
import { getLanguage, i18n } from "material/i18n"
import { whitelist } from "./storage/local-storage"

const _ = i18n(undefined, false)

export const authFetch = async <T>(url: string): Promise<T | null> => {
    while (1) {
        const accessToken = await getAccessToken()
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

const setTokens = async ([refreshToken, accessToken]: string[]) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    navigate(HOME)
}

export const getAccessToken = async () => localStorage.getItem(ACCESS_TOKEN_KEY)
export const getRefreshToken = async () =>
    localStorage.getItem(REFRESH_TOKEN_KEY)
export const checkAuth = async () => (await getAccessToken()) !== null

export const refreshToken = async () => {
    const token = await getRefreshToken()
    const [tokens, status] = await singleFetch<string[]>(
        api(`/auth/refresh?token=${token}`)
    )
    if (tokens) await setTokens(tokens)
    return status
}
export const login = async (username: string, password: string) => {
    const [tokens, status] = await singleFetch<string[]>(api("/auth/login"), {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ username, password }),
    })
    if (tokens) await setTokens(tokens)
    return status
}

export const logout = async () => {
    storage.clear()
    for (const key in localStorage) {
        if (whitelist.includes(key)) continue
        localStorage.removeItem(key)
    }
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    const token = await getRefreshToken()
    fetch(api(`/auth/logout?token=${token}`))
}
