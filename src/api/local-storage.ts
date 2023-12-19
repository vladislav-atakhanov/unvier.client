export const ATTESTATION_KEY = "attestation"
export const SCHEDULE_KEY = "schedule"
export const TOKEN_KEY = "access-token"
export const EXAMS = "exams"

const whitelist = ["username", "color-scheme"]
export const clearLocalStorage = () => {
    const keys = { ...localStorage }
    for (const key in keys) {
        if (whitelist.includes(key)) continue
        localStorage.removeItem(key)
    }
}
