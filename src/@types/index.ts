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

export interface Transcript {
    fullname: string
    faculty: string
    level_of_the_qualification: string
    level_of_education: string
    education_program: string
    education_program_group: string
    language: string
    year_of_study: number
    length_of_program: number
    graid_point: number
    avarage_point: number
    form_of_study: string
}
