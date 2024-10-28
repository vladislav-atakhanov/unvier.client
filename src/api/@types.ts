export type Transcript = {
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

export type FAQ = {
    id: string
    label: string
}

export type Exam = {
    date: number
    subject: string
    teacher: string
    teacher_link?: string
    audience: string
    type: "consultation" | "exam"
}
