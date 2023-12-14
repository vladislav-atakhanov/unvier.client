import { authFetch } from "./auth"
import { api } from "./config"

import { type Readable, writable, get } from "svelte/store"
import { onMount } from "svelte"

export const createFetchData =
    <T>(path: string) =>
    () =>
        authFetch<T>(api(path))

type Store<T> = Readable<T | null> & { update: () => void }

const UPDATE_DELAY = 5 * 60 * 1000
export const createUseData =
    <T>(fetchData: () => Promise<T>, key: string, check = (d: T) => !!d) =>
    (): [Store<T>, Readable<boolean>] => {
        const store = writable<T | null>(null)
        const { subscribe, set } = store
        const loading = writable(false)

        const lastUpdateKey = `${key}-last-update`

        const update = async () => {
            loading.set(true)
            const data = await fetchData()
            loading.set(false)
            localStorage.setItem(lastUpdateKey, `${Date.now()}`)
            if (data && check(data)) {
                set(data)
                localStorage.setItem(key, JSON.stringify(data))
            }
        }

        const needUpdate = (callback: () => void) => {
            const data = get(store)
            if (!data || !check(data)) return callback()

            const now = Date.now()
            const lastUpdate =
                parseInt(localStorage.getItem(lastUpdateKey) || "") || 0
            if (now - lastUpdate >= UPDATE_DELAY) return callback()
        }

        onMount(() => {
            const data = localStorage.getItem(key)
            if (data) set(JSON.parse(data))
            needUpdate(update)
        })
        return [{ subscribe, update }, { subscribe: loading.subscribe }]
    }
