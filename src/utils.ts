export const groupBy = <T extends Record<string, any>>(
    array: T[],
    key: keyof T | ((v: T) => unknown)
) => {
    const getKey = typeof key === "function" ? key : (value: T) => value[key]
    return array.reduce((map, value) => {
        const factor = getKey(value)
        if (map.has(factor) === false) {
            map.set(factor, [value])
            return map
        }
        map.get(factor)?.push(value)
        return map
    }, new Map())
}
