import { api } from "./config"

export class Version {
    server = $state("")
    loading = $state(true)
    client = ""
    update = $derived(this.loading ? false : this.server !== this.client)
    constructor(client: string) {
        this.client = client
    }
    async fetch() {
        this.loading = true
        this.server = await fetch(api("/api/version")).then((request) =>
            request.json()
        )
        this.loading = false
    }
}
