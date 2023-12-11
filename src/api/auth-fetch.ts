import { getToken, isAuth, refreshToken } from "./token"

export const authFetch = async <T>(path: string): Promise<T | null> => {
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
