export const hostMatches = (anchor: HTMLAnchorElement) => {
    const host = location.host
    return (
        anchor.host === host ||
        anchor.href.indexOf(`https://${host}`) === 0 ||
        anchor.href.indexOf(`http://${host}`) === 0
    )
}

export const shouldNavigate = (event: PointerEvent) =>
    !event.defaultPrevented &&
    event.button === 0 &&
    !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)

export const debounce = <F extends (...args: Parameters<F>) => ReturnType<F>>(
    fn: F,
    delay: number
) => {
    let timeout: ReturnType<typeof setTimeout>
    return (...args: Parameters<F>) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            fn.apply(null, args)
        }, delay)
    }
}

export const findClosest = <T extends HTMLElement>(
    tagName: string,
    el: HTMLElement
): T => {
    while (el && el.tagName !== tagName) el = el.parentNode
    return el as T
}

export const prefs = {
    array: {
        separator: ",",
        format: "bracket",
    },
    convertTypes: true,
    breakHooks: true,
    hashbang: false,
    anchor: false,
    scroll: false,
    focus: false,
    nesting: 3,
    sideEffect: true,
    base: "",
}

export function convertType(val) {
    if (Array.isArray(val)) {
        val[val.length - 1] = convertType(val[val.length - 1])
        return val
    } else if (typeof val === "object") {
        return Object.entries(val).reduce((obj, [k, v]) => {
            obj[k] = convertType(v)
            return obj
        }, {})
    }

    if (val === "true" || val === "false") {
        return val === "true"
    } else if (val === "null") {
        return null
    } else if (val === "undefined") {
        return undefined
    } else if (
        val !== "" &&
        !isNaN(Number(val)) &&
        Number(val).toString() === val
    ) {
        return Number(val)
    } else if (prefs.array.format === "separator" && typeof val === "string") {
        const arr = val.split(prefs.array.separator)
        return arr.length > 1 ? arr : val
    }
    return val
}
