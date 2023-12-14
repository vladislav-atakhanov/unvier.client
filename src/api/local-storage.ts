export const ATTESTATION_KEY = "attestation"
export const SCHEDULE_KEY = "schedule"
export const TOKEN_KEY = "access-token"
export const EXAMS = "exams"
export const clearLocalStorage = () =>
    [ATTESTATION_KEY, TOKEN_KEY, SCHEDULE_KEY, EXAMS].forEach((key) =>
        localStorage.removeItem(key)
    )
