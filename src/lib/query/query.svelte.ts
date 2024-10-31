import { nullish } from "$lib/utils"

type Promisify<T> = () => Promise<T>
type Params<T> = {
    onReject?: (reason: unknown) => unknown
    onResolve?: (value: T) => unknown
    enabled?: boolean
    preload?: () => Promise<T | undefined> | undefined
}

export class Query<T> {
    state = $state<"load" | "update" | "ready">("load")
    data = $state<T>()
    loading = $derived(this.state !== "ready")
    hasData = false

    private promisify = $state<Promisify<T>>()

    constructor(
        promisify: Promisify<T> | Promise<T>,
        private params: Params<T> = { enabled: true }
    ) {
        this.promisify =
            typeof promisify === "function" ? promisify : () => promisify
        params
            .preload?.()
            ?.then((data) => {
                if (nullish(data)) return
                this.data = data
                this.hasData = true
            })
            .then(() => this.fetch())
    }
    async fetch() {
        if (!this.params.enabled) return
        if (!this.promisify) return Promise.reject()
        this.state = this.hasData ? "update" : "ready"
        try {
            const data = await this.promisify()
            this.state = "ready"
            this.params.onResolve?.(data)
            this.data = data
            this.hasData = true
            return data
        } catch (error) {
            this.params.onReject?.(error)
            return Promise.reject(error)
        }
    }
    update() {
        this.fetch()
    }
}
