const cache = new Map<string | URL, Promise<unknown>>()

type _Promise<T> = Promise<[T | null, number]>
export const singleFetch = <T>(
    url: string | URL,
    params?: RequestInit,
    reader: (r: Response) => unknown = (r) => r.json()
) => {
    if (cache.has(url)) return cache.get(url) as _Promise<T>
    const promise = new Promise(async (resolve) => {
        try {
            const response = await fetch(url, params)
            const { status } = response
            const data = status === 200 ? await reader(response) : null
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
