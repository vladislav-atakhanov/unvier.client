import type { Language } from "$lib/i18n"
import { api } from "./config"
import { CachedPromise } from "./utils"

export function fetchFAQ(lang: Language) {
    const url = api(`/faq?lang=${lang}`)
    return CachedPromise<{ id: string; label: string }[]>(
        url,
        fetch(url).then((r) => r.json())
    )
}

export function fetchFAQItem(id: string, lang: Language) {
    const url = api(`/faq/${id}?lang=${lang}`)
    return CachedPromise<string>(
        url,
        fetch(url).then((r) => r.text())
    )
}
