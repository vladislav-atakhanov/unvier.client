export interface Storage {
    getItem<T>(key: string): Promise<T | null>
    setItem<T>(key: string, value: T): Promise<void>
    clear(): Promise<void>
}
