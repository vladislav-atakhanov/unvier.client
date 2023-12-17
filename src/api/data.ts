import { authFetch } from "./auth"
import { api } from "./config"

import { type Readable, writable, get } from "svelte/store"
import { onMount } from "svelte"

type Store<T> = Readable<T | null> & { update: () => void }
type LoadingStore = Readable<boolean>
type Result<T> = [Store<T>, LoadingStore]

const UPDATE_DELAY = 5 * 60 * 1000

const stores = new Map<string, Result<unknown>>()

export const createUseData =
    <T>(path: string, key: string, check = (d: T) => !!d) =>
    (): Result<T> => {
        if (stores.has(path)) return stores.get(path) as Result<T>

        const fetchData = () => authFetch<T>(api(path))
        const store = writable<T | null>(null)
        const { subscribe, set } = store
        const loading = writable(false)

        const lastUpdateKey = `${key}-last-update`
        const needUpdate = () => {
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
                localStorage.setItem(key, JSON.stringify(data))
            }
        }

        onMount(() => {
            const data = localStorage.getItem(key)
            if (data) set(JSON.parse(data))
            if (needUpdate()) update()
        })
        const result: Result<T> = [
            { subscribe, update },
            { subscribe: loading.subscribe },
        ]
        stores.set(path, result)
        return result
    }
