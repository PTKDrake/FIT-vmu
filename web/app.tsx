import { createInertiaApp } from "@inertiajs/react"
import type { ComponentType } from "react"
import { createRoot } from "react-dom/client"
import { initializeTheme } from "@/hooks/use-theme"

const appName = import.meta.env.VITE_APP_NAME || "Laravel"
const pages = import.meta.glob<{ default: ComponentType }>( "./pages/**/*.tsx")

void createInertiaApp({
  title: (title) => (title ? `${title} - ${appName}` : appName),
  resolve: (name) => {
    const page = pages[`./pages/${name}.tsx`]

    if (!page) {
      throw new Error(`Page not found: ${name}`)
    }

    return page().then((module) => module.default as ComponentType)
  },
  setup({ el, App, props }) {
    createRoot(el!).render(<App {...props} />)
  },
  strictMode: true,
  progress: {
    color: "#4B5563",
  },
})

initializeTheme()
