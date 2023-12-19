import type { Storage } from "./storage"
import { localStorageKeys } from "material"

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

export const local = new LocalStorage(["username", ...localStorageKeys])
