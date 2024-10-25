import { tick } from "svelte"
import type { HistoryItem, ParametersExceptFirst, Router } from "./@types"
import { pattern } from "./pattern"
import type { App } from "../../app.svelte"

export class HistoryRouter implements Router {
    path = $state("")
    query = $state("")
    fragment = $state("")
    history = $state<HistoryItem[]>([])
    app?: App

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
                const history = [this.#item(path)]
                if (this.history.length !== 1) this.history = history
                if (this.history[0].path !== path) this.history = history
            } else {
                if (this.history.findIndex(({ path: p }) => p === path) === -1)
                    this.history.push(this.#item(path))
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
        const { scrollLeft } = this.element
        if (this.app?.drawer && scrollLeft === 0) {
            this.app.drawerState = "open"
            return
        }
        const drawerWidth = this.app?.drawer?.clientWidth ?? 0
        if (this.app?.drawer && scrollLeft === drawerWidth) {
            this.app.drawerState = "close"
            return
        }

        const index = Math.round((scrollLeft - drawerWidth) / window.innerWidth)
        if (index + 1 !== this.history.length) {
            this.history = this.history.slice(0, index + 1)
            const { path, fragment, query } = this.history.at(-1) as HistoryItem
            this.path = path
            this.fragment = fragment
            this.query = query
        }
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
