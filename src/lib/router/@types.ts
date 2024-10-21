import type { Component } from "svelte"

export type Navigate = (
    route: Route,
    params?: { mode: "replace" | "push" }
) => void

export type Middleware = (actions: {
    render: () => void
    navigate: Navigate
}) => unknown

export type Route = {
    component: Component
    middleware?: Middleware
    path: string
}

const getPaths = (routes: Record<string, Route>) => {
    const result: Record<string, Route> = {}
    for (const route of Object.values(routes)) {
        result[route.path] = route
    }
    return result
}

const prototype = {
    get(path: string): Route {
        const paths = getPaths(this)
        return paths[path]
    },
}

export const Routes = <T extends string>(
    routes: Record<T, Route>
): Record<T, Route> & typeof prototype => {
    Object.setPrototypeOf(routes, prototype)
    return routes as any
}
