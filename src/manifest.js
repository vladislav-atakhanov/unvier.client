import { HOME } from "./url"

/**
 *
 * @param {number} size
 * @param {(size: number) => string} [path]
 * @param {string} type
 * @returns
 */
const icon = (
    size,
    path = (size) => `images/icons/${size}.png`,
    type = "image/png"
) => ({
    src: path(size),
    sizes: `${size}x${size}`,
    type,
})

export default {
    theme_color: "#7f67be",
    background_color: "#fff",
    display: "standalone",
    scope: "/",
    start_url: HOME,
    name: "Univer",
    short_name: "Univer",
    icons: [icon(64), icon(128), icon(192), icon(512)],
}
