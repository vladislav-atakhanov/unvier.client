import { api } from "./config"

class Version {
    client = "Ps9Oynpy"
    server = $state("")
    loading = $state(true)
    update = $derived(this.loading ? false : this.server !== this.client)
    async fetch() {
        this.loading = true
        this.server = await fetch(api("/api/version")).then((request) =>
            request.json()
        )
        this.loading = false
    }
}
export const version = new Version()
