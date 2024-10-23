import { api } from "./config"

let promise: Promise<string>
export function fetchPrivacy() {
    if (promise) return promise
    promise = new Promise((resolve, reject) =>
        fetch(api("/api/privacy-policy"))
            .then((request) => request.json())
            .then(resolve)
            .catch(reject)
    )
    return promise
}
