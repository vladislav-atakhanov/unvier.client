const API_PATH = import.meta.env.DEV
    ? "http://localhost:7435"
    : "https://api.kstu.kz"
export const api = (path: string) => `${API_PATH}${path}`
