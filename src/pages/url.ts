export const routes = {
    attestation: "/attestation",
    login: "/login",
    schedule: "/schedule",
    profile: "/profile",
    exams: "/schedule/exams",
    calculator: `/attestation/calculator`,
    settings: "/settings",
    privacy: "/privacy",
    files: "/files",
    filesItem: "/files/:id",
    telegram: "https://t.me/univerapp",
    faq: "/faq",
    faqItem: "/faq/:id",

    get home() {
        return this.schedule
    },
}
