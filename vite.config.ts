import { defineConfig } from "vite"
import { svelte } from "@sveltejs/vite-plugin-svelte"
import { VitePWA } from "vite-plugin-pwa"
import manifest from "./src/manifest"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [svelte(), VitePWA({ manifest })],
})
