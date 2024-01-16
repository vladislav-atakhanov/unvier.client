export const groupBy = <T extends Record<string, any>>(
    array: T[],
    key: keyof T | ((v: T) => string)
): [string, T[]][] => {
    const getKey = typeof key === "function" ? key : (value: T) => value[key]
    const map = array.reduce((map, value) => {
        const factor = getKey(value)
        if (map.has(factor) === false) {
            map.set(factor, [value])
            return map
        }
        map.get(factor)?.push(value)
        return map
    }, new Map<string, T[]>())
    return Array.from(map.entries())
}
export const debounce = <T extends Function>(cb: T, wait = 20) => {
    let h = 0
    const callable = (...args: any) => {
        clearTimeout(h)
        h = setTimeout(() => cb(...args), wait)
    }
    return <T>(<any>callable)
}
