import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import "@blocknote/xl-ai/style.css";
import "@puckeditor/core/puck.css";
import { createInertiaApp } from "@inertiajs/react";
import { NuqsAdapter } from "nuqs/adapters/react";
import type { ComponentType } from "react";
import { createRoot } from "react-dom/client";
import { Toast } from "@/components/ui/toast";
import { initializeTheme } from "@/hooks/use-theme";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";
const pages = import.meta.glob<{ default: ComponentType }>("./pages/**/*.tsx");

void createInertiaApp({
  title: (title) => (title ? `${title} - ${appName}` : appName),
  resolve: (name) => {
    const page = pages[`./pages/${name}.tsx`];

    if (!page) {
      throw new Error(`Page not found: ${name}`);
    }

    return page().then((module) => module.default as ComponentType);
  },
  setup({ el, App, props }) {
    createRoot(el!).render(
      <NuqsAdapter>
        <>
          <App {...props} />
          <Toast position="top-right" />
        </>
      </NuqsAdapter>,
    );
  },
  strictMode: true,
  progress: {
    color: "#4B5563",
  },
});

initializeTheme();
