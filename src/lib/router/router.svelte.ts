import { tick } from "svelte"
import type { HistoryItem, ParametersExceptFirst, Router } from "./@types"
import { pattern } from "./pattern"
import type { App } from "../../app.svelte"

type ScrollHandler = (event: { x: number }) => unknown
export class HistoryRouter implements Router {
    path = $state("")
    query = $state("")
    fragment = $state("")
    history = $state<HistoryItem[]>([])
    app?: App

    element?: HTMLElement
    isBrowserBack = false
    #scrollHandlers = new Set<ScrollHandler>()
    constructor(home: string) {
        this.navigate(home, { mode: "replace" })

        const self = this
        const onpopstate = () => {
            this.isBrowserBack = true
            self.back()
            setTimeout(() => (this.isBrowserBack = false), 1000)
        }
        $effect(() => {
            if (window.location.pathname !== "/") {
                this.navigate(window.location.pathname, { mode: "replace" })
            }
            window.addEventListener("popstate", onpopstate)
            return () => window.removeEventListener("popstate", onpopstate)
        })
    }

    #item(path: string): HistoryItem {
        return {
            path,
            fragment: this.fragment,
            query: this.query,
        }
    }

    #updateLocation(mode: "push" | "replace" | "back", path?: string) {
        if (mode === "back") {
            if (!this.isBrowserBack) window.history.back()
            return
        }
        const action = mode === "push" ? "pushState" : "replaceState"
        window.history[action](null, "", path)
    }

    navigate(path: string, { mode = "push" } = {}) {
        tick().then(() => {
            if (mode === "replace") {
                const history = [this.#item(path)]
                if (
                    this.history.length !== 1 ||
                    this.history[0].path !== path
                ) {
                    this.history = history
                    this.#updateLocation("replace", path)
                }
            } else {
                if (
                    this.history.findIndex(({ path: p }) => p === path) === -1
                ) {
                    this.history.push(this.#item(path))
                    this.#updateLocation("push", path)
                }
            }
            this.path = path
            tick().then(() => {
                this.#scrollTo(this.element?.scrollWidth)
            })
        })
    }
    #scrollTo(value?: number) {
        this.element?.scrollTo({
            left: value,
            behavior: "smooth",
        })
    }
    back() {
        if (!this.element) return
        const pages = this.element.querySelectorAll(".page")
        const targetPage = pages[pages.length - 2]
        targetPage?.scrollIntoView({
            behavior: "smooth",
        })
    }

    pattern(...args: ParametersExceptFirst<typeof pattern>) {
        return pattern(this.path, ...args)
    }
    onScrollEnd() {
        if (!this.element) return
        if (this.history.length === 1) return
        const { scrollLeft } = this.element
        const index = Math.round(scrollLeft / window.innerWidth)
        if (index + 1 !== this.history.length) {
            this.history = this.history.slice(0, index + 1)
            const { path, fragment, query } = this.history.at(-1) as HistoryItem
            this.path = path
            this.fragment = fragment
            this.query = query
            this.#updateLocation("back")
        }
    }
    onscroll() {
        if (!this.element) return
        const event: Parameters<ScrollHandler>[0] = {
            x: this.element.scrollLeft,
        }
        this.#scrollHandlers.forEach((handler) => handler(event))
    }
    addOnScroll(handler: ScrollHandler) {
        this.#scrollHandlers.add(handler)
        return () => this.#scrollHandlers.delete(handler)
    }
}
export class ItemRouter implements Router {
    constructor(private router: Router, private item: HistoryItem) {}
    navigate(...params: Parameters<Router["navigate"]>) {
        return this.router.navigate(...params)
    }
    back(...params: Parameters<Router["back"]>) {
        return this.router.back(...params)
    }
    pattern(...params: Parameters<Router["pattern"]>) {
        return pattern(this.path, ...params)
    }
    get path() {
        return this.item.path
    }
    set path(value: string) {
        this.router.path = value
    }
    get query() {
        return this.item.query
    }
    set query(value: string) {
        this.router.query = value
    }
    get fragment() {
        return this.item.fragment
    }
    set fragment(value: string) {
        this.router.fragment = value
    }
}
