import { writable } from "svelte/store"
import { api } from "./config"

const TOKEN_KEY = "access-token"

export const setToken = async (token: string) => {
    localStorage.setItem(TOKEN_KEY, token)
    isAuth.set(true)
}

export const getToken = async () => localStorage.getItem(TOKEN_KEY)

export const refreshToken = async () => {
    const accessToken = await fetch(api("/auth/refresh"), {
        method: "GET",
        credentials: "include",
    }).then((r) => r.json())
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

export const isAuth = writable(!!getToken())
