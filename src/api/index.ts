export { login, refreshToken, logout, checkAuth } from "./auth"
import { createUseData } from "./data"
import { storage } from "./storage"
import type { Attestation, Schedule, Exam, Transcript } from "../@types"
import {
    ATTESTATION_KEY,
    SCHEDULE_KEY,
    EXAMS,
    SERVER_VERSION,
    TRANSCRIPT,
    PRIVACY_POLICY,
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
    {
        check(schedule) {
            if (!schedule) return false
            return schedule.lessons.length > 0
        },
        storage,
    }
)
