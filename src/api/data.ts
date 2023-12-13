import { authFetch } from "./auth"
import { api } from "./config"

import { type Readable, writable } from "svelte/store"
import { onMount } from "svelte"

export const createFetchData =
    <T>(path: string) =>
    () =>
        authFetch<T>(api(path))

export const createUseData =
    <T>(fetchData: () => Promise<T>, key: string) =>
    (): [Readable<T | null> & { refresh: () => void }, Readable<boolean>] => {
        const { subscribe, set } = writable<T | null>(null)
        const loading = writable(true)

        const refresh = async () => {
            loading.set(true)
            const data = await fetchData()
            if (data) {
                set(data)
                localStorage.setItem(key, JSON.stringify(data))
            }
            loading.set(false)
        }

        onMount(() => {
            const data = localStorage.getItem(key)
            if (data) set(JSON.parse(data))
            refresh()
            return () => {
                set(null)
                loading.set(true)
            }
        })
        return [{ subscribe, refresh }, { subscribe: loading.subscribe }]
    }
