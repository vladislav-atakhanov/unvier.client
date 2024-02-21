import type { UmkdFile } from "../@types"
import { authFetch } from "./auth"
import { api } from "./config"

export const fetchUmkdFiles = async (id: string): Promise<UmkdFile[]> =>
    (await authFetch<UmkdFile[]>(api(`/api/umkd/${id}`))) ?? []

export const fetchFAQFile = async (id: string) => {
    const data = await authFetch<string>(api(`/faq/${id}`), (r) => r.text())
    return data || ""
}
