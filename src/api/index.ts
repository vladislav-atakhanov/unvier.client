import { api } from "./config.ts"

export { checkAuth, login } from "./auth.svelte.ts"
export { version } from "./version.svelte.ts"

export async function fetchPrivacy() {
    const data = await fetch(api("/api/privacy-policy")).then((request) =>
        request.json()
    )
    return data
}
