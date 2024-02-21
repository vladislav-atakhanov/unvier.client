export { login, refreshToken, logout, checkAuth, useIsAuth } from "./auth"
import { createUseData } from "./data"
import { storage } from "./storage"
import type {
    Attestation,
    Schedule,
    Exam,
    Transcript,
    UmkdFolder,
    FAQ,
} from "../@types"
import {
    ATTESTATION_KEY,
    SCHEDULE_KEY,
    EXAMS,
    SERVER_VERSION,
    TRANSCRIPT,
    PRIVACY_POLICY,
    UMKD_KEY,
    FAQ_KEY,
} from "./storage-keys"

export const useAttestation = createUseData<Attestation[]>(
    "/api/attestation",
    ATTESTATION_KEY,
    { storage }
)

export const useExams = createUseData<Exam[]>("/api/exams", EXAMS, { storage })
export const useTranscript = createUseData<Transcript>(
    "/api/transcript",
    TRANSCRIPT,
    { storage }
)
export const useServerVersion = createUseData<string>(
    "/api/version",
    SERVER_VERSION,
    { storage }
)
export const usePrivacyPolicy = createUseData<string>(
    "/api/privacy-policy",
    PRIVACY_POLICY,
    { storage }
)

export const useSchedule = createUseData<Schedule>(
    "/api/schedule",
    SCHEDULE_KEY,
    { storage }
)

export const useUmkd = createUseData<UmkdFolder[]>("/api/umkd", UMKD_KEY, {
    storage,
})
export const useFAQ = createUseData<FAQ[]>("/faq", FAQ_KEY, {
    storage,
})
