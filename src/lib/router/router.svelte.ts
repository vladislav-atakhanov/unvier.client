import { tick } from "svelte"
import type { HistoryItem, ParametersExceptFirst, Router } from "./@types"
import { pattern } from "./pattern"

export class HistoryRouter implements Router {
    path = $state("")
    query = $state("")
    fragment = $state("")
    history = $state<HistoryItem[]>([])

    element?: HTMLElement
    constructor(home: string) {
        this.history.push(this.#item(home))
        this.path = home
    }

    #item(path: string): HistoryItem {
        return {
            path,
            fragment: this.fragment,
            query: this.query,
        }
    }

    navigate(path: string, { mode = "push" } = {}) {
        tick().then(() => {
            if (mode === "replace") {
                this.history = [this.#item(path)]
            } else {
                if (this.history.findIndex(({ path: p }) => p === path) === -1)
                    this.history.push(this.#item(path))
            }
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
        const screenWidth =
            this.element?.clientWidth / (this.history.length - 1)
        this.#scrollTo(this.element?.scrollLeft - screenWidth)
    }

    pattern(...args: ParametersExceptFirst<typeof pattern>) {
        return pattern(this.path, ...args)
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
