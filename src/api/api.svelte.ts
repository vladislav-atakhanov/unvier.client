import { login, logout, checkAuth, authFetch } from "./auth.svelte.ts"
import { Version } from "./version.svelte.ts"
import { fetchPrivacy } from "./privacy.ts"
import { fetchFAQ, fetchFAQItem } from "./faq.ts"
import { fetchTranscript } from "./transcript.ts"

import { Query } from "$lib/query"
import {
    BadRequest,
    NotFound,
    RequestTimeout,
    ServerError,
    Unauthorized,
} from "$api/errors"

import { toast } from "svelte-sonner"
import { _, i18n, type Language } from "$lib/i18n/index.ts"
import type { App } from "../app.svelte"
import { getContext, onDestroy, setContext } from "svelte"
import { api } from "./config.ts"

export class Api {
    version = new Version("Ps9Oynpy")
    #queries = new Map<string, Query<any>>()
    constructor(private app: App) {
        $effect(() => {
            i18n.language
            this.#queries.forEach((q) => {
                q.update()
            })
        })
    }
    #catch(error: unknown) {
        if (error instanceof Unauthorized) {
            toast(_("error.invalid-credentials"))
            logout()
            this.app.logout()
        } else if (error instanceof BadRequest) {
            toast(_("version.update-required"))
        } else if (error instanceof NotFound || error instanceof ServerError) {
            toast(_("error.server-error"))
        } else if (error instanceof RequestTimeout) {
            toast(_("error.univer-error"))
        } else if (error instanceof Error) {
            toast(_("error.unknown-error", error.message))
        }
    }
    fetchTranscript() {
        return this.#languageQuery(fetchTranscript, {
            key: "transcript",
        })
    }
    fetchPrivacy() {
        return this.#languageQuery(fetchPrivacy, {
            key: "privacy",
        })
    }
    fetchFAQ() {
        return this.#languageQuery(fetchFAQ, {
            key: "faq",
        })
    }
    fetchFAQItem(id: string) {
        return this.#languageQuery((lang) => fetchFAQItem(id, lang), {
            key: `faq-${id}`,
        })
    }
    fetchExams() {
        return this.#languageQuery(
            () =>
                authFetch<
                    {
                        date: number
                        subject: string
                        teacher: string
                        teacher_link?: string
                        audience: string
                        type: "consultation" | "exam"
                    }[]
                >(api("/api/exams")),
            {
                key: "exams",
            }
        )
    }
    login(...args: Parameters<typeof login>) {
        return login(...args)
    }
    logout(...args: Parameters<typeof logout>) {
        return logout(...args)
    }
    checkAuth() {
        return checkAuth()
    }
    #languageQuery<T>(
        fetch: (lang: Language) => Promise<T>,
        { key }: { key: string }
    ) {
        const cached = this.#queries.get(key)
        if (cached) return cached as Query<T>
        const query = new Query(() => fetch(i18n.language), {
            onReject: (error) => this.#catch(error),
            get enabled() {
                return i18n.language.length > 0
            },
        })
        this.#queries.set(key, query)
        onDestroy(() => {
            this.#queries.delete(key)
        })
        return query
    }
}

export const API = Symbol("api")
export const useApi = () => getContext<Api>(API)
export const setApi = (api: Api) => setContext(API, api)
