import inertia from "@inertiajs/vite"
import { wayfinder } from "@laravel/vite-plugin-wayfinder"
import optimizeLocales from "@react-aria/optimize-locales-plugin"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import laravel from "laravel-vite-plugin"
import { fileURLToPath, URL } from "node:url"
import { defineConfig } from "vite"

export default defineConfig({
    plugins: [
        laravel({
            input: ["resources/css/app.css", "resources/css/public.css", "web/app.tsx"],
            refresh: true,
        }),
        inertia(),
        react({
            babel: {
                plugins: ["babel-plugin-react-compiler"],
            },
        }),
        tailwindcss(),
        wayfinder({
            formVariants: true,
            path: "web",
            command: "./phpw artisan wayfinder:generate --with-form --path=web",
        }),
        {
            ...optimizeLocales.vite({
                locales: ["en-US", "fr-FR"],
            }),
            enforce: "pre",
        },
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./web", import.meta.url)),
        },
        dedupe: [
            "@blocknote/core",
            "@blocknote/react",
            "@blocknote/shadcn",
            "@blocknote/xl-ai",
            "framer-motion",
            "motion",
            "prosemirror-model",
            "prosemirror-state",
            "prosemirror-transform",
            "prosemirror-view",
            "react",
            "react-dom",
        ],
    },
})
