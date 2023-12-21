import { HOME } from "./url"

/**
 * @typedef Params
 * @type {object}
 * @property {string | ((size: number) => string)} [path]
 * @property {string} [type]
 * @property {"maskable" | "badge" | "any"} [purpose]
 */

/**
 *
 * @param {number} size
 * @param {Params} params
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

export default {
    theme_color: "#7f67be",
    background_color: "#fff",
    display: "standalone",
    scope: "/",
    start_url: HOME,
    name: "Univer",
    short_name: "Univer",
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
}
