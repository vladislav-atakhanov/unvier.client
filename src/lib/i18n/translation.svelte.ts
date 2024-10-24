import ru from "./ru.json"
import kk from "./kk.json"
import en from "./en.json"

export const locales = { ru, kk, en }
type Locale = (typeof locales)[keyof typeof locales]

class Translation {
    language: keyof typeof locales = $state("ru")
    obj: Locale = $derived(locales[this.language])
    constructor(public translations: Record<string, Locale>) {}
    translate(key: keyof Locale, ...params: unknown[]) {
        let result = this.translations[this.language][key]
        for (const param of params) result = result.replace("{}", `${param}`)
        return result
    }
    apply(_: unknown) {
        this.language = (localStorage.getItem("lang") as any) ?? "ru"
        $effect(() => {
            localStorage.setItem("lang", this.language)
            document.documentElement.setAttribute("lang", this.language)
        })
    }
}
export const i18n = new Translation(locales as any)

export const _ = (key: keyof Locale, ...params: unknown[]) =>
    i18n.translate(key, ...params)
