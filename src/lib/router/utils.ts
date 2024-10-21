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
export const next = (action: () => any, ms = 0) => setTimeout(action, ms)
