const cache = new Map<string | URL, Promise<unknown>>()

type _Promise<T> = Promise<[T | null, number]>
export const singleFetch = <T>(url: string | URL, params?: RequestInit) => {
    if (cache.has(url)) return cache.get(url) as _Promise<T>
    const promise = new Promise(async (resolve) => {
        try {
            const response = await fetch(url, params)
            const { status } = response
            const data = status === 200 ? await response.json() : null
            resolve([data, status])
        } catch (e) {
            resolve([null, 404])
        } finally {
            cache.delete(url)
        }
    })
    cache.set(url, promise)
    return promise as _Promise<T>
}
