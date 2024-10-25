import { authFetch } from "./auth.svelte"
import { api } from "./config"
import type { Language } from "$lib/i18n"
import { CachedPromise } from "./utils"

export function fetchTranscript(lang: Language) {
    const url = api(`/api/transcript?lang=${lang}`)
    return CachedPromise(
        url,
        authFetch<{
            fullname: string
            faculty: string
            level_of_the_qualification: string
            level_of_education: string
            education_program: string
            education_program_group: string
            language: string
            year_of_study: number
            length_of_program: number
            graid_point: number
            avarage_point: number
            form_of_study: string
        }>(url)
    )
}
