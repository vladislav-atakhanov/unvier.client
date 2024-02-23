import { writable } from "svelte/store"

export interface Note {
    text: string
    date: number
    id: string
}

export interface Notes {
    _list: Record<string, Note>
    getNote: (lessonId: string) => Note
}

const getFromLocalStorage = <T>(key: string, default_: T): T => {
    const localValue = localStorage.getItem(key)
    if (localValue) return JSON.parse(localValue)
    return default_
}

const DEFAULT_NOTES = { _list: {} } as Notes
export const Notes = (storageKey = "notes") => {
    const get = () => {
        const notes = getFromLocalStorage<Notes>(storageKey, DEFAULT_NOTES)
        notes.getNote = (id) =>
            notes._list[id] ?? {
                text: "",
                id,
            }
        return notes
    }
    const notes = get()
    const { subscribe, update } = writable(notes)

    return {
        subscribe,
        setNote(id: string, text: string) {
            if (text.length > 0)
                notes._list[id] = {
                    text: text.trim(),
                    date: Date.now(),
                    id,
                }
            else delete notes._list[id]
            localStorage.setItem(storageKey, JSON.stringify(notes))
            update(() => notes)
        },
        getNote: notes.getNote,
    }
}

export const notes = Notes()
