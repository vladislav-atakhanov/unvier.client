import { localStorageKeys } from "material"
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../storage-keys"
import type { Storage } from "./storage"

export const whitelist = [
    "username",
    "univer",
    ACCESS_TOKEN_KEY,
    REFRESH_TOKEN_KEY,
    ...localStorageKeys,
]
class LocalStorage implements Storage {
    constructor(private whitelist: string[]) {}
    async getItem<T>(key: string) {
        const local = localStorage.getItem(key)
        if (!local) return null
        return JSON.parse(local) as T
    }
    async setItem<T>(key: string, value: T) {
        localStorage.setItem(key, JSON.stringify(value))
    }
    async clear(): Promise<void> {
        for (const key in localStorage) {
            if (this.whitelist.includes(key)) continue
            localStorage.removeItem(key)
        }
    }
}

export const local = new LocalStorage(whitelist)
