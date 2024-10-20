export const ATTESTATION = "/attestation"
export const LOGIN = "/login"
export const SCHEDULE = "/schedule"
export const PROFILE = "/profile"
export const EXAMS = "/schedule/exams"
export const CALCULATOR = "/attestation/calculator"
export const SETTINGS = "/settings"
export const PRIVACY_POLICY = "/privacy"
export const TELEGRAM = "https://t.me/univerapp"
export const UMKD = "/umkd"
export const FAQ = "/faq"

export const HOME = SCHEDULE
export const AUTH_PATHS = {
    list: [
        ATTESTATION,
        SCHEDULE,
        PROFILE,
        EXAMS,
        CALCULATOR,
        SETTINGS,
        PRIVACY_POLICY,
        UMKD,
        FAQ,
    ],

    includes(url: string) {
        const isOrStarts = (u: string) => u === url || url.startsWith(u)
        return this.list.find(isOrStarts) !== undefined
    },
}
