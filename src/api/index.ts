export { login, refreshToken, logout, isAuth } from "./auth"
import { createFetchData, createUseData } from "./data"

import type { Attestation, Schedule, Exam } from "../@types"
import { ATTESTATION_KEY, SCHEDULE_KEY, EXAMS } from "./local-storage"

export const useAttestation = createUseData(
    createFetchData<Attestation[]>("/api/attestation"),
    ATTESTATION_KEY
)

export const useExams = createUseData(
    createFetchData<Exam[]>("/api/exams"),
    EXAMS
)

export const useSchedule = createUseData(
    createFetchData<Schedule>("/api/schedule"),
    SCHEDULE_KEY,
    (schedule) => {
        if (!schedule) return false
        return schedule.lessons.length > 0
    }
)
