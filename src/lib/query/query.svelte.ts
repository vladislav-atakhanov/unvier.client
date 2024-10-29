type Promisify<T> = () => Promise<T>
type Params<T> = {
    onReject?: (reason: unknown) => unknown
    onResolve?: (value: T) => unknown
    enabled?: boolean
}

export class Query<T> {
    state = $state<"load" | "update" | "ready">("load")
    data = $state<T>()
    loading = $derived(this.state !== "ready")

    private promisify = $state<Promisify<T>>()

    constructor(
        promisify: Promisify<T> | Promise<T>,
        private params: Params<T> = { enabled: true }
    ) {
        this.promisify =
            typeof promisify === "function" ? promisify : () => promisify
        this.load()
    }
    async #fetch() {
        if (!this.params.enabled) return
        if (!this.promisify) return Promise.reject()
        try {
            const data = await this.promisify()
            this.state = "ready"
            this.params.onResolve?.(data)
            this.data = data
            return data
        } catch (error) {
            this.params.onReject?.(error)
            return Promise.reject(error)
        }
    }
    load() {
        this.state = "load"
        return this.#fetch()
    }
    update() {
        this.state = "update"
        return this.#fetch()
    }
}
