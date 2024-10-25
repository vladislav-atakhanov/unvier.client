type Promisify<T> = () => Promise<T>
type Params<T> = {
    onReject?: (reason: unknown) => unknown
    onResolve?: (value: T) => unknown
}

class Query<T> {
    loading = $state(true)
    private promisify = $state<Promisify<T>>()
    private promise = $derived.by<Promise<T>>(() => this.#derive())

    constructor(
        promisify: Promisify<T> | Promise<T>,
        private params: Params<T> = {}
    ) {
        this.promisify =
            typeof promisify === "function" ? promisify : () => promisify
    }
    async #derive() {
        if (!this.promisify) return Promise.reject()
        try {
            const value = await this.promisify()
            this.params.onResolve?.(value)
            return value
        } catch (error) {
            this.params.onReject?.(error)
            return Promise.reject(error)
        }
    }
    then(...args: Parameters<Promise<T>["then"]>) {
        return this.promise.then(...args)
    }
    catch(...args: Parameters<Promise<T>["catch"]>) {
        return this.promise.catch(...args)
    }
}

export function useQuery<T>(
    promisify: Promisify<T> | Promise<T>,
    params?: Params<T>
) {
    return new Query(promisify, params)
}
