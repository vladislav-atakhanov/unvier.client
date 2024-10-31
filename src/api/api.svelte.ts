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
    Schedule,
    Note,
} from "./@types.ts"

type Notes = { _list: Record<string, Note> }

import { get, set, del } from "idb-keyval"

type Storage<K = IDBValidKey> = {
    get: <T>(key: K) => Promise<T | undefined>
    set: <T>(key: K, value: T) => Promise<void>
    del: (key: K) => Promise<void>
}
const storage: Storage = { get, set, del }
export class Api {
    version = new Version("Ps9Oynpy")
    #queries = new Map<string, Query<any>>()
    notes = $state<Notes["_list"]>({})
    constructor(private app: App) {
        $effect(() => {
            i18n.language
            this.#queries.forEach((q) => {
                q.update()
            })
        })
        $effect(() => {
            this.notes = this.#getNotesFromLocalStorage()._list
        })
    }
    url(...args: Parameters<typeof api>) {
        return api(...args)
    }
    setNote(id: string, text: string) {
        const notes = this.#getNotesFromLocalStorage()
        if (text.length > 0) {
            notes._list[id] = {
                text: text.trim(),
                date: Date.now(),
                id,
            }
        } else {
            delete notes._list[id]
        }
        localStorage.setItem("notes", JSON.stringify(notes))
        this.notes = notes._list
    }
    #getNotesFromLocalStorage() {
        const local = localStorage.getItem("notes")
        if (!local) return { _list: {} } as Notes
        return JSON.parse(local) as Notes
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
                storage,
            }
        )
    }
    fetchSchedule() {
        return this.#languageQuery(
            () => authFetch<Schedule>(api("/api/schedule")),
            {
                key: "schedule",
                storage,
            }
        )
    }
    fetchTranscript() {
        return this.#languageQuery(
            () => authFetch<Transcript>(api("/api/transcript")),
            {
                key: "transcript",
                storage,
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
                storage,
            }
        )
    }
    fetchFiles(id: Folder["id"]) {
        return this.#languageQuery(
            () => authFetch<File[]>(api(`/api/umkd/${id}`)),
            {
                key: `files-${id}`,
                storage,
            }
        )
    }
    fetchExams() {
        return this.#languageQuery(() => authFetch<Exam[]>(api("/api/exams")), {
            key: "exams",
            storage,
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
        { key, storage }: { key: string; storage?: Storage }
    ) {
        const cached = this.#queries.get(key)
        if (cached) return cached as Query<T>
        const query = new Query(() => fetch(i18n.language), {
            onReject: (error) => {
                storage?.del(key)
                this.#catch(error)
            },
            onResolve: (data) => storage?.set(key, data),
            preload: () => storage?.get(key),
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
