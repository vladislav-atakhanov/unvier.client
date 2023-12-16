import { api } from "./config"
import { HOME, LOGIN } from "../url"
import { navigate } from "material"
import { TOKEN_KEY, clearLocalStorage } from "./local-storage"
import { singleFetch } from "./utils"

export const authFetch = async <T>(url: string): Promise<T | null> => {
    while (1) {
        try {
            const accessToken = await getToken()
            const [data, status] = await singleFetch<T>(
                `${url}?token=${accessToken}`
            )
            if (status === 403) {
                const status = await refreshToken()
                if (status === 403) {
                    navigate(LOGIN)
                    return null
                }
            }
            return data
        } catch (e) {
            // !!TODO show error
            break
        }
    }
    return null
}

const setToken = async (token: string | null) => {
    if (token === null) {
        localStorage.removeItem(TOKEN_KEY)
        return navigate(LOGIN)
    }
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
    if (accessToken) {
        await setToken(accessToken)
    }
    return status
}
export const login = async (username: string, password: string) => {
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

export const logout = () => {
    setToken(null)
    clearLocalStorage()
    fetch(api("/auth/logout"), {
        method: "GET",
        credentials: "include",
    })
}
