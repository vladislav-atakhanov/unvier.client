import type { pattern } from "./pattern"

export type ParametersExceptFirst<F> = F extends (
    arg0: any,
    ...rest: infer R
) => any
    ? R
    : never

export interface HistoryItem {
    path: string
    query: string
    fragment: string
}

export interface NavigateParams {
    mode?: "push" | "replace"
}

export interface Router {
    path: string
    query: string
    fragment: string
    element?: HTMLElement
    navigate: (path: string, params?: NavigateParams) => void
    back: () => void
    pattern: (
        ...args: ParametersExceptFirst<typeof pattern>
    ) => ReturnType<typeof pattern>
}
