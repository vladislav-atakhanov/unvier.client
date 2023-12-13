const API_PATH = import.meta.env.DEV ? "http://localhost:7435" : ""
export const api = (path: string) => `${API_PATH}${path}`
