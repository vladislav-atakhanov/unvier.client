export { login, refreshToken, logout, isAuth } from "./auth"
import { createFetchData, createUseData } from "./data"

import type { Attestation, Schedule } from "../@types"
import { ATTESTATION_KEY, SCHEDULE_KEY } from "./local-storage"

export const fetchAttestation =
    createFetchData<Attestation[]>("/api/attestation")
export const useAttestation = createUseData(fetchAttestation, ATTESTATION_KEY)

export const fetchSchedule = createFetchData<Schedule>("/api/schedule")
export const useSchedule = createUseData(fetchSchedule, SCHEDULE_KEY)
