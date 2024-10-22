import ru from "./ru.json"
import kk from "./kk.json"
import en from "./en.json"

export const locales = { ru, kk, en }
type Locale = (typeof locales)["ru"]

class Translation {
    locale: keyof typeof locales = $state("ru")
    obj: Locale = $derived(locales[this.locale])
    constructor(public translations: Record<string, Locale>) {}
    translate(key: keyof Locale, ...params: string[]) {
        let result = this.translations[this.locale][key]
        for (const param of params) result = result.replace("{}", param)

        return result
    }
}
const translations = new Translation(locales as any)

export const _ = (key: keyof Locale, ...params: string[]) =>
    translations.translate(key, ...params)

export function setLocale(locale: keyof typeof locales) {
    translations.locale = locale
}
