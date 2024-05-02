export type Mark = [title: string, value: number, active?: boolean]

export interface Attestation {
    subject: string
    attestation: Mark[]
    attendance: {
        type: string // лекция | срсп
        part: string // рк1 | рк2
        marks: Mark[]
    }[]
    sum: Mark
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
    id: string
}

export interface Schedule {
    lessons: Lesson[]
    factor: boolean | null
    week: number
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

export interface UmkdFolder {
    subject: string
    id: string
    type: string
}
export interface UmkdFile {
    name: string
    description: string
    type: string
    language: string | null
    size: string
    date: number
    downloads_count: number
    teacher: string
    teacher_link?: string
    url: string
}

export interface FAQ {
    id: string
    label: string
}
