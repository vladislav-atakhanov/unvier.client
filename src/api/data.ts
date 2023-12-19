import { authFetch } from "./auth"
import { api } from "./config"

import { type Readable, writable, get } from "svelte/store"
import { onMount } from "svelte"
import type { Storage } from "./storage"

type Store<T> = Readable<T | null> & {
    update: () => void
    updateIfNeed: () => void
}
type LoadingStore = Readable<boolean>
type Result<T> = [Store<T>, LoadingStore]

const UPDATE_DELAY = 5 * 60 * 1000

const stores = new Map<string, Result<unknown>>()

export const createUseData =
    <T>(
        path: string,
        key: string,
        {
            check = (d) => !!d,
            storage,
        }: { check?: (d: T) => boolean; storage: Storage }
    ) =>
    (): Result<T> => {
        if (stores.has(path)) return stores.get(path) as Result<T>

        const fetchData = () => authFetch<T>(api(path))
        const store = writable<T | null>(null)
        const { subscribe, set } = store
        const loading = writable(false)

        const lastUpdateKey = `${key}-last-update`
        const needUpdate = async () => {
            if (get(store) === null) return true

            const now = Date.now()
            const lastUpdate = parseInt(
                localStorage.getItem(lastUpdateKey) || "0"
            )
            if (now - lastUpdate >= UPDATE_DELAY) return true
            const mountTime = parseInt(
                localStorage.getItem("mount-time") || "0"
            )

            return lastUpdate < mountTime
        }

        const update = async () => {
            if (get(loading)) return
            loading.set(true)
            const data = await fetchData()
            loading.set(false)
            localStorage.setItem(lastUpdateKey, `${Date.now()}`)
            if (data && check(data)) {
                set(data)
                await storage.setItem(key, data)
            }
        }

        const updateIfNeed = async () => {
            if (await needUpdate()) update()
        }
        onMount(async () => {
            const data = await storage.getItem<T>(key)
            if (data) set(data)
            await updateIfNeed()
        })
        const result: Result<T> = [
            { subscribe, update, updateIfNeed },
            { subscribe: loading.subscribe },
        ]
        stores.set(path, result)
        return result
    }
