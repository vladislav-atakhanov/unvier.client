import { defineConfig } from "vite"
import { svelte } from "@sveltejs/vite-plugin-svelte"
import { VitePWA } from "vite-plugin-pwa"
import legacy from "@vitejs/plugin-legacy"

import path from "node:path"
import manifest from "./src/manifest.js"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        svelte(),
        VitePWA({ manifest, includeAssets: ["images/icons.svg"] }),
        legacy({
            targets: ["defaults", "not IE 11"],
        }),
    ],
    resolve: {
        alias: {
            $lib: path.resolve("./src/lib"),
            $api: path.resolve("./src/api"),
        },
    },
})
