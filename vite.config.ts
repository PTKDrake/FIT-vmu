import inertia from "@inertiajs/vite"
import { wayfinder } from "@laravel/vite-plugin-wayfinder"
import optimizeLocales from "@react-aria/optimize-locales-plugin"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import laravel from "laravel-vite-plugin"
import fs from "node:fs"
import { fileURLToPath, URL } from "node:url"
import { defineConfig } from "vite"

const viteHost = "fitvmu.mcmevn.com"
const viteCertificatePath = `/etc/nginx/certs/${viteHost}.pem`
const viteKeyPath = `/etc/nginx/certs/${viteHost}-key.pem`
const hasLocalTlsCertificate =
    fs.existsSync(viteCertificatePath) && fs.existsSync(viteKeyPath)

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
    server: {
        host: "0.0.0.0",
        port: 5173,
        strictPort: true,
        origin: hasLocalTlsCertificate ? `https://${viteHost}:5173` : undefined,
        cors: {
            origin: [`https://${viteHost}`],
        },
        hmr: {
            host: viteHost,
            port: 5173,
            protocol: hasLocalTlsCertificate ? "wss" : "ws",
        },
        https: hasLocalTlsCertificate
            ? {
                  cert: fs.readFileSync(viteCertificatePath),
                  key: fs.readFileSync(viteKeyPath),
              }
            : undefined,
    },
})
