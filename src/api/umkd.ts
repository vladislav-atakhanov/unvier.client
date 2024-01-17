import type { UmkdFile } from "../@types"
import { authFetch } from "./auth"
import { api } from "./config"

export const fetchUmkdFiles = async (id: string): Promise<UmkdFile[]> =>
    (await authFetch<UmkdFile[]>(api(`/api/umkd/${id}`))) ?? []
