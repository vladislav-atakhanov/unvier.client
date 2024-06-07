import { api } from "./config"
import { LOGIN } from "../url"
import { navigate } from "material/routing"
import { storage } from "./storage"
import { singleFetch } from "./utils"
import { addSnack } from "material/notificator"
import { getLanguage, translate as _ } from "material/i18n"
import { whitelist } from "./storage/local-storage"
import SecureStorage from "secure-web-storage"
import { readonly, writable } from "svelte/store"
import { onMount } from "svelte"

const secret = "6cceadbb-1602-4e90-8893-5c872e157575"
const secureStorage: Storage = new SecureStorage(localStorage, {
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

export const authFetchUrl = (apiUrl: string) => {
    const url = new URL(apiUrl)
    url.searchParams.append("lang", getLanguage())
    return url
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

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

interface User {
    username: string
    password: string
    univer: string
}

let loginPromise: Promise<number> | null = null

export const login = (user: User) => {
    if (loginPromise) return loginPromise
    loginPromise = new Promise(async (resolve) => {
        const { status } = await fetch(api("/auth/login"), {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(user),
        })
        if (status === 200) {
            const { password } = user
            secureStorage.setItem("password", password)
            isAuth.set(true)
        }
        resolve(status)
    })
    loginPromise.then(() => setTimeout(() => (loginPromise = null), 1000))
    return loginPromise
}

export const logout = async () => {
    storage.clear()
    for (const key in localStorage) {
        if (whitelist.includes(key)) continue
        localStorage.removeItem(key)
    }
    fetch(api(`/auth/logout`), { credentials: "include" })
    isAuth.set(false)
    navigate(LOGIN)
}

export const checkAuth = () => secureStorage.getItem("password") !== null

const isAuth = writable(false)

export const useIsAuth = () => {
    onMount(() => {
        if (checkAuth()) isAuth.set(true)
    })
    return readonly(isAuth)
}
