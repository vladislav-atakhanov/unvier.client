import ru from "./ru.json"
import kk from "./kk.json"
import en from "./en.json"

export const locales = { ru, kk, en }
export type Language = keyof typeof locales
type Locale = (typeof locales)[Language]

const defaultLanguage = "ru"
class Translation {
    language = $state<Language>(defaultLanguage)

    obj: Locale = $derived(locales[this.language])
    constructor(public translations: Record<string, Locale>) {}
    translate(key: keyof Locale, ...params: unknown[]) {
        if (!this.language) return key
        let result = this.translations[this.language][key]
        for (const param of params) result = result.replace("{}", `${param}`)
        return result
    }
    #localStorageLanguage(): Language | undefined {
        return localStorage.getItem("lang") as Language
    }
    #navigatorLanguage(): Language | undefined {
        const language = navigator.language.split("-")[0].toLowerCase()
        for (const key in locales) if (language == key) return key as Language
    }
    apply(_: unknown) {
        this.language =
            this.#localStorageLanguage() ??
            this.#navigatorLanguage() ??
            defaultLanguage
        $effect(() => {
            localStorage.setItem("lang", this.language)
            document.documentElement.setAttribute("lang", this.language)
        })
    }
}
export const i18n = new Translation(locales as any)

export const _ = (key: keyof Locale, ...params: unknown[]) =>
    i18n.translate(key, ...params)
