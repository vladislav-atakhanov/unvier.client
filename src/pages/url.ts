export const routes = {
    attestation: "/attestation",
    login: "/login",
    schedule: "/schedule",
    profile: "/profile",
    exams: "/schedule/exams",
    calculator: `/attestation/calculator`,
    settings: "/settings",
    privacy: "/privacy",
    umkd: "/umkd",
    telegram: "https://t.me/univerapp",
    faq: "/faq",

    get home() {
        return this.schedule
    },
}
