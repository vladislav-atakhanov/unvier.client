import { authFetch } from "./auth.svelte"
import { api } from "./config"

let promise: Promise<{
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
}>
export function fetchTranscript() {
    if (promise) return promise
    promise = new Promise((resolve, reject) =>
        authFetch<any>(api("/api/transcript")).then(resolve).catch(reject)
    )
    return promise
}
