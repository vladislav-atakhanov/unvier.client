import { login, logout, checkAuth, authFetch } from "./auth.svelte.ts"
import { Version } from "./version.svelte.ts"

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
import type {
    Exam,
    FAQ,
    Transcript,
    Folder,
    File,
    Attestation,
} from "./@types.ts"

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
    url(...args: Parameters<typeof api>) {
        return api(...args)
    }
    fetchAttestation() {
        return this.#languageQuery(
            () =>
                authFetch<Attestation[]>(api("/api/attestation")).then((data) =>
                    data
                        .sort(({ subject: a }, { subject: b }) =>
                            a.localeCompare(b)
                        )
                        .map((a) => {
                            a.attendance.map((v) => {
                                v.marks = v.marks.filter(
                                    ([_, value]) =>
                                        typeof value === "string" || value > 0
                                )
                                return v
                            })
                            a.attendance = a.attendance.filter(
                                ({ marks }) => marks.length > 0
                            )
                            return a
                        })
                ),
            {
                key: "attestation",
            }
        )
    }
    fetchTranscript() {
        return this.#languageQuery(
            () => authFetch<Transcript>(api("/api/transcript")),
            {
                key: "transcript",
            }
        )
    }
    fetchPrivacy() {
        return this.#languageQuery<string>(
            (lang) =>
                fetch(api(`/api/privacy-policy?lang=${lang}`)).then((r) =>
                    r.json()
                ),
            {
                key: "privacy",
            }
        )
    }
    fetchFAQ() {
        return this.#languageQuery<FAQ[]>(
            (lang) => fetch(api(`/faq?lang=${lang}`)).then((r) => r.json()),
            {
                key: "faq",
            }
        )
    }
    fetchFAQItem(id: FAQ["id"]) {
        return this.#languageQuery<string>(
            (lang) =>
                fetch(api(`/faq/${id}?lang=${lang}`)).then((r) => r.text()),
            {
                key: `faq-${id}`,
            }
        )
    }
    fetchFolders() {
        return this.#languageQuery(
            () =>
                authFetch<Folder[]>(api("/api/umkd")).then((data) =>
                    data.sort(({ subject: a }, { subject: b }) =>
                        a.localeCompare(b)
                    )
                ),
            {
                key: "files",
            }
        )
    }
    fetchFiles(id: Folder["id"]) {
        return this.#languageQuery(
            () => authFetch<File[]>(api(`/api/umkd/${id}`)),
            {
                key: `files-${id}`,
            }
        )
    }
    fetchExams() {
        return this.#languageQuery(() => authFetch<Exam[]>(api("/api/exams")), {
            key: "exams",
        })
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
}

export const API = Symbol("api")
export const useApi = () => getContext<Api>(API)
export const setApi = (api: Api) => setContext(API, api)
