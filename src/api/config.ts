const API_PATH = import.meta.env.DEV
    ? "http://localhost:7435"
    : "https://univerapi.eloh1m.com"
export const api = (path: string) => `${API_PATH}${path}`
