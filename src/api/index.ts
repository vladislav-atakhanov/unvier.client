import type { Attestation } from "../@types"
import { authFetch } from "./auth-fetch"
import { api } from "./config"
export { login, refreshToken, isAuth } from "./token"

export const getAttestation = () =>
    authFetch<Attestation[]>(api("/api/attestation"))
