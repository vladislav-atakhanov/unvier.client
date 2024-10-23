import { api } from "./config"

let promise: Promise<{ id: string; label: string }[]>
export function fetchFAQ() {
    if (promise) return promise
    promise = new Promise((resolve, reject) =>
        fetch(api("/faq"))
            .then((request) => request.json())
            .then(resolve)
            .catch(reject)
    )
    return promise
}

const faqItems = new Map<string, Promise<string>>()
export const fetchFAQItem = (id: string): Promise<string> => {
    if (faqItems.has(id)) return faqItems.get(id) as any
    const promise = new Promise<string>((resolve, reject) =>
        fetch(api(`/faq/${id}`))
            .then((request) => request.text())
            .then(resolve)
            .catch(reject)
    )
    faqItems.set(id, promise)

    return promise
}
