import { authFetch } from "./auth"
import { api } from "./config"

import { type Readable, writable, get } from "svelte/store"
import { onMount } from "svelte"
import type { Storage } from "./storage"

type Store<T> = Readable<T | null> & {
    update: (checkLoading?: boolean) => void
}
type LoadingStore = Readable<boolean>
type Result<T> = [Store<T>, LoadingStore]

const UPDATE_DELAY = 5 * 60 * 1000

const stores = new Map<string, Result<unknown>>()

export const updateAllStores = () => {
    for (const [store] of stores.values()) store.update(false)
}

const needUpdate = async <T>(
    store: Readable<T | null>,
    lastUpdateKey: string
) => {
    if (get(store) === null) return true

    const now = Date.now()
    const lastUpdate = parseInt(localStorage.getItem(lastUpdateKey) || "0")
    if (now - lastUpdate >= UPDATE_DELAY) return true
    const mountTime = parseInt(localStorage.getItem("mount-time") || "0")

    return lastUpdate < mountTime
}

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

        const update = async (checkLoading = true) => {
            if (checkLoading && get(loading)) return
            loading.set(true)
            const data = await fetchData()

            loading.set(false)
            localStorage.setItem(lastUpdateKey, `${Date.now()}`)
            if (data && check(data)) {
                set(data)
                await storage.setItem(key, data)
            }
        }

        onMount(async () => {
            const data = await storage.getItem<T>(key)
            if (data) set(data)
            if (await needUpdate(store, lastUpdateKey)) update()
        })
        const result: Result<T> = [
            { subscribe, update },
            { subscribe: loading.subscribe },
        ]
        stores.set(path, result)
        return result
    }
