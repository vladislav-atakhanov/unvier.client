import { api } from "./config"
import { getToken, isAuth, refreshToken } from "./token"

export { login, refreshToken, isAuth } from "./token"

const authFetch = async (path: string) => {
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
}

export const getAttestation = async () => {
    const attestation = await authFetch(api("/api/attestation"))
    return attestation as {
        subject: string
        summary: {
            title: string
            value: number
        }[]
    }[]
}
