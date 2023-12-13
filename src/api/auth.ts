import { api } from "./config"
import { HOME, LOGIN } from "../url"
import { navigate } from "material"
import { TOKEN_KEY, clearLocalStorage } from "./local-storage"

export const authFetch = async <T>(path: string): Promise<T | null> => {
    while (1) {
        try {
            const accessToken = await getToken()
            const response = await fetch(`${path}?token=${accessToken}`)
            if (response.status === 403) {
                const status = await refreshToken()
                if (status === 403) {
                    navigate(LOGIN)
                    return null
                }
            }
            const data = await response.json()
            console.log(data)
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
export const isAuth = () => !!getToken()

export const refreshToken = async () => {
    const response = await fetch(api("/auth/refresh"), {
        method: "GET",
        credentials: "include",
    })
    if (response.status !== 200) return response.status
    const accessToken = await response.json()
    await setToken(accessToken)
}

export const login = async (username: string, password: string) => {
    const accessToken = await fetch(api("/auth/login"), {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ username, password }),
    }).then((r) => r.json())
    await setToken(accessToken)
}

export const logout = () => {
    setToken(null)
    clearLocalStorage()
    fetch(api("/auth/logout"), {
        method: "GET",
        credentials: "include",
    })
}
