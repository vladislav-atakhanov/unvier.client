/**
 * @typedef IconParams
 * @type {object}
 * @property {string | ((size: number) => string)} [path]
 * @property {string} [type]
 * @property {"maskable" | "badge" | "any"} [purpose]
 */

import { HOME } from "./pages/url"

/**
 *
 * @param {number} size
 * @param {IconParams} params
 * @returns
 */
const icon = (
    size,
    {
        path = (size) => `images/icons/${size}.png`,
        type = "image/png",
        purpose,
    } = {}
) => ({
    src: typeof path === "string" ? path : path(size),
    sizes: `${size}x${size}`,
    type,
    purpose,
})

/** @param {string} name */
const mobileScreenshot = (name) => ({
    src: `images/screens/mobile/${name}.jpg`,
    type: "image/jpeg",
    sizes: "540x1067",
    form_factor: "narrow",
})
/** @param {string} name */
const desktopScreenshot = (name) => ({
    src: `images/screens/desktop/${name}.jpg`,
    type: "image/jpeg",
    sizes: "800x450",
    form_factor: "wide",
})

export default {
    theme_color: "#7f67be",
    background_color: "#fff",
    display: "standalone",
    scope: "/",
    start_url: HOME,
    name: "Univer",
    short_name: "Univer",
    description:
        "Приложение для просмотра оценок, расписания занятий и экзаменов, и другой информации о студенте.",
    icons: [
        icon(64),
        icon(128),
        icon(192),
        icon(512),
        icon(512, {
            purpose: "maskable",
            path: "images/icons/maskable.png",
        }),
    ],
    screenshots: [
        mobileScreenshot("schedule"),
        mobileScreenshot("attendance"),
        mobileScreenshot("marks"),
        mobileScreenshot("calculator"),
        mobileScreenshot("exams"),
        mobileScreenshot("profile"),
        desktopScreenshot("schedule"),
        desktopScreenshot("attendance"),
        desktopScreenshot("profile"),
    ],
}
