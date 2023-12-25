import { api } from "./config"
import { HOME, LOGIN } from "../url"
import { navigate } from "material"
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "./storage-keys"
import { storage } from "./storage"
import { singleFetch } from "./utils"
import { addSnack } from "material/notificator"
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
        if (status === 403) {
            addSnack(_("error.invalid-credentials"))
            navigate(LOGIN)
            logout()
            return null
        }

        if (status === 404 || (status >= 500 && status < 600))
            addSnack(_("error.server-error"))
        else if (status === 408) addSnack(_("error.univer-error"))
        else addSnack(_("error.unknown-error", status))
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
    if (!token) return 401
    const [tokens, status] = await singleFetch<string[]>(
        api(`/auth/refresh?token=${token}`)
    )
    if (tokens) await setTokens(tokens)
    return status
}

interface User {
    username: string
    password: string
    univer: string
}

export const login = async (user: User) => {
    const [tokens, status] = await singleFetch<string[]>(api("/auth/login"), {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(user),
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
