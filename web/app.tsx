import { createInertiaApp } from "@inertiajs/react";
import { NuqsAdapter } from "nuqs/adapters/react";
import type { ComponentType } from "react";
import { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";
import { initializeTheme } from "@/hooks/use-theme";
import { authLayoutProps } from "@/layouts/auth-layout";
import GuestLayout from "@/layouts/guest-layout";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";
const pages = import.meta.glob<{ default: ComponentType }>("./pages/**/*.tsx");
const Toast = lazy(() =>
  import("@/components/ui/toast").then((module) => ({
    default: module.Toast,
  })),
);

void createInertiaApp({
  title: (title) => (title ? `${title} - ${appName}` : appName),
  layout: (name) => {
    const props = authLayoutProps[name];

    if (!props) {
      return null;
    }

    return {
      component: GuestLayout,
      props,
    };
  },
  resolve: (name) => {
    const page = pages[`./pages/${name}.tsx`];

    if (!page) {
      throw new Error(`Page not found: ${name}`);
    }

    return page().then((module) => module.default as ComponentType);
  },
  setup({ el, App, props }) {
    const container = el as HTMLElement & { __vmuRoot?: Root };
    const root = container.__vmuRoot ?? createRoot(container);

    container.__vmuRoot = root;

    root.render(
      <NuqsAdapter>
        <>
          <App {...props} />
          <AppToast component={props.initialPage.component} />
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

function AppToast({ component }: { component: string }) {
  const needsToast = !component.startsWith("public/");

  if (!needsToast) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <Toast position="top-right" />
    </Suspense>
  );
}
