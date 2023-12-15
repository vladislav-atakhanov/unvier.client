export { login, refreshToken, logout, checkAuth } from "./auth"
import { createUseData } from "./data"

import type { Attestation, Schedule, Exam } from "../@types"
import { ATTESTATION_KEY, SCHEDULE_KEY, EXAMS } from "./local-storage"

export const useAttestation = createUseData<Attestation[]>(
    "/api/attestation",
    ATTESTATION_KEY
)

export const useExams = createUseData<Exam[]>("/api/exams", EXAMS)

export const useSchedule = createUseData<Schedule>(
    "/api/schedule",
    SCHEDULE_KEY,
    (schedule) => {
        if (!schedule) return false
        return schedule.lessons.length > 0
    }
)
