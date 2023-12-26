import { api } from "./config"
import { HOME, LOGIN } from "../url"
import { navigate } from "material"
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "./storage-keys"
import { storage } from "./storage"
import { singleFetch } from "./utils"
import { addSnack } from "material/notificator"
import { getLanguage, i18n } from "material/i18n"
import { whitelist } from "./storage/local-storage"
import SecureStorage from "secure-web-storage"

const _ = i18n(undefined, false)

const secret = "6cceadbb-1602-4e90-8893-5c872e157575"
const secureStorage = new SecureStorage(localStorage, {
    hash(message: string) {
        var hash = 0,
            i,
            chr
        if (message.length === 0) return hash
        for (i = 0; i < message.length; i++) {
            chr = message.charCodeAt(i)
            hash = (hash << 5) - hash + chr
            hash |= 0 // Convert to 32bit integer
        }
        return hash.toString()
    },
    encrypt(data: string) {
        return encrypt(data, secret)
    },
    decrypt(data: string) {
        return encrypt(data, secret)
    },
})

const encrypt = (message: string, key: string) => {
    let _key = key
    while (_key.length < message.length) _key += key

    const result = Array.from(message).reduce((result, m, index) => {
        const k = _key[index]
        result += String.fromCharCode(m.charCodeAt(0) ^ k.charCodeAt(0))
        return result
    }, "")
    return result
}

const encryptPassword = async (password: string) => {
    const [data, status] = await singleFetch<{ date: number; secret: string }>(
        api("/api/secret")
    )
    if (!data) return {}
    const { date, secret } = data

    return {
        date: `${date}`,
        key: encrypt(password, secret),
    }
}

export const authFetch = async <T>(url: string): Promise<T | null> => {
    while (1) {
        const password = secureStorage.getItem("password")
        if (!password) {
            navigate(LOGIN)
            logout()
            return null
        }
        const [accessToken, payload] = await Promise.all([
            getAccessToken(),
            encryptPassword(password),
        ])

        const queryString = new URLSearchParams({
            token: accessToken || "",
            lang: getLanguage(),
            ...payload,
        } as any).toString()
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
    if (tokens) {
        await setTokens(tokens)
        secureStorage.setItem("password", user.password)
    }
    return status
}

export const logout = async () => {
    storage.clear()
    for (const key in localStorage) {
        if (whitelist.includes(key)) continue
        localStorage.removeItem(key)
    }
    const token = await getRefreshToken()
    fetch(api(`/auth/logout?token=${token}`))
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
}
