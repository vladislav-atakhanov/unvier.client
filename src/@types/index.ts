export interface Mark {
    title: string
    value: number
}

export interface Attestation {
    subject: string
    attestation: Mark[]
}

export interface Lesson {
    subject: string
    teacher: string
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
