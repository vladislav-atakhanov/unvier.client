export type Mark = [title: string, value: number, active?: boolean]

export interface Attestation {
    subject: string
    attestation: Mark[]
    attendance: {
        type: string // лекция | срсп
        part: string // рк1 | рк2
        marks: Mark[]
    }[]
}

export interface Exam {
    date: number
    subject: string
    teacher: string
    teacher_link?: string
    audience: string
    type: "consultation" | "exam"
}

export interface Lesson {
    subject: string
    teacher: string
    teacher_link?: string
    audience: string
    period: string
    day: number
    time: string
    factor: boolean
}

export interface Schedule {
    lessons: Lesson[]
    factor: boolean
}
