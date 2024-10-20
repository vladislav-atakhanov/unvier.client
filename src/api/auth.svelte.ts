import { api } from "./config"

interface User {
    username: string
    password: string
    univer: string
}

let loginPromise: Promise<number> | null = null

let isAuth = $state(false)
export const checkAuth = () => isAuth

export const login = (user: User) => {
    if (loginPromise) return loginPromise
    loginPromise = new Promise(async (resolve) => {
        await new Promise((r) => setTimeout(r, 1000))
        try {
            const { status } = await fetch(api("/auth/login"), {
                method: "POST",
                credentials: "include",
                body: JSON.stringify(user),
            })
            if (status === 200) {
                const { password } = user
                isAuth = true
            }
            resolve(status)
        } catch {
            resolve(404)
        }
    })
    loginPromise.then(() => setTimeout(() => (loginPromise = null), 1000))
    return loginPromise
}
