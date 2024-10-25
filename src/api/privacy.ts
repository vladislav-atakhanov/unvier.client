import type { Language } from "$lib/i18n"
import { api } from "./config"
import { CachedPromise } from "./utils"

export function fetchPrivacy(lang: Language) {
    const url = api(`/api/privacy-policy?lang=${lang}`)
    return CachedPromise<string>(
        url,
        fetch(url).then((r) => r.json())
    )
}
