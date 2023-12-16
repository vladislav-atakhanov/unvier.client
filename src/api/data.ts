import { authFetch } from "./auth"
import { api } from "./config"

import { type Readable, writable, get } from "svelte/store"
import { onMount } from "svelte"

type Store<T> = Readable<T | null> & { update: () => void }

const UPDATE_DELAY = 5 * 60 * 1000
export const createUseData =
    <T>(path: string, key: string, check = (d: T) => !!d) =>
    (): [Store<T>, Readable<boolean>] => {
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
        return [{ subscribe, update }, { subscribe: loading.subscribe }]
    }
