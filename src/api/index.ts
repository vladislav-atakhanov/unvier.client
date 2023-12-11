import type { Attestation } from "../@types"
import { api } from "./config"
import { getToken, isAuth, refreshToken } from "./token"

export { login, refreshToken, isAuth } from "./token"

const authFetch = async <T>(path: string): Promise<T | null> => {
    while (1) {
        try {
            const accessToken = await getToken()
            return await fetch(`${path}?token=${accessToken}`).then((r) =>
                r.json()
            )
        } catch (e) {
            try {
                await refreshToken()
            } catch (e) {
                isAuth.set(false)
                return null
            }
        }
    }
    return null
}

export const getAttestation = () =>
    authFetch<Attestation[]>(api("/api/attestation"))
