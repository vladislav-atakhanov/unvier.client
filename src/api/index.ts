export { login, refreshToken, logout, checkAuth } from "./auth"
import { createUseData } from "./data"
import { storage } from "./storage"
import type { Attestation, Schedule, Exam } from "../@types"
import { ATTESTATION_KEY, SCHEDULE_KEY, EXAMS } from "./storage-keys"

export const useAttestation = createUseData<Attestation[]>(
    "/api/attestation",
    ATTESTATION_KEY,
    { storage }
)

export const useExams = createUseData<Exam[]>("/api/exams", EXAMS, { storage })

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
