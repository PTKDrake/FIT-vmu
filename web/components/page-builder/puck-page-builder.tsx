import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { router } from "@inertiajs/react";
import { Puck, createUsePuck, useGetPuck } from "@puckeditor/core";
import { twMerge } from "tailwind-merge";
import { PuckSelectField } from "@/components/layout-builder/puck-select-field";
import { Button } from "@/components/ui/button";
import { useMountEffect } from "@/hooks/use-mount-effect";
import { vmuFitPageBuilderConfig } from "@/lib/puck/page-builder-config";
import {
  clonePuckPageData,
  getPuckPageContentFormat,
  isEmptyPuckPageData,
  parsePuckPageData,
  serializePuckPageData,
} from "@/lib/puck/page-builder-data";
import type {
  VmuFitPageBuilderData,
  VmuFitPageBuilderValue,
} from "@/lib/puck/page-builder-data";

const usePageBuilderPuck = createUsePuck<typeof vmuFitPageBuilderConfig>();

export interface PuckPageBuilderChange {
  data: VmuFitPageBuilderData;
  format: "puck_json";
  isEmpty: boolean;
  json: string;
}

export interface PuckPageBuilderProps {
  backHref?: string;
  backLabel?: string;
  canSave?: boolean;
  className?: string;
  content?: VmuFitPageBuilderValue;
  editorKey?: string | number;
  headerTitle?: string;
  isSaving?: boolean;
  onChange?: (value: PuckPageBuilderChange) => void;
  onPublish?: (value: PuckPageBuilderChange) => void;
  onSave?: (value: PuckPageBuilderChange) => void;
}

export function PuckPageBuilder({
  backHref,
  backLabel = "Danh sách",
  canSave = true,
  className,
  content,
  editorKey,
  headerTitle = "Page",
  isSaving = false,
  onChange,
  onPublish,
  onSave,
}: PuckPageBuilderProps) {
  const initialData = parsePuckPageData(content);

  useMountEffect(() => {
    const syncTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      const iframe = document.querySelector(
        ".vmu-puck-page-builder iframe",
      ) as HTMLIFrameElement | null;

      if (iframe && iframe.contentDocument) {
        const iframeHtml = iframe.contentDocument.documentElement;
        const iframeHead = iframe.contentDocument.head;

        if (iframeHtml) {
          if (iframeHtml.classList.contains("dark") !== isDark) {
            iframeHtml.classList.toggle("dark", isDark);
            iframeHtml.style.colorScheme = isDark ? "dark" : "light";
          }
        }

        // Programmatically inject Google Sans fonts and override CSS variable
        if (iframeHead) {
          if (!iframeHead.querySelector('link[href*="fonts.googleapis.com"]')) {
            const preconnect1 = iframe.contentDocument.createElement("link");
            preconnect1.rel = "preconnect";
            preconnect1.href = "https://fonts.googleapis.com";
            iframeHead.appendChild(preconnect1);

            const preconnect2 = iframe.contentDocument.createElement("link");
            preconnect2.rel = "preconnect";
            preconnect2.href = "https://fonts.gstatic.com";
            preconnect2.crossOrigin = "anonymous";
            iframeHead.appendChild(preconnect2);

            const fontLink = iframe.contentDocument.createElement("link");
            fontLink.rel = "stylesheet";
            fontLink.href =
              "https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap";
            iframeHead.appendChild(fontLink);
          }

          if (!iframeHead.querySelector("#puck-iframe-font-override")) {
            const fontOverride = iframe.contentDocument.createElement("style");
            fontOverride.id = "puck-iframe-font-override";
            fontOverride.innerHTML = `
              :root {
                --font-sans: "Google Sans", "Inter", ui-sans-serif, system-ui, sans-serif !important;
                --font-display: "Google Sans", "Inter", ui-sans-serif, system-ui, sans-serif !important;
              }
              body, html, .puck-preview {
                font-family: "Google Sans", "Inter", ui-sans-serif, system-ui, sans-serif !important;
              }
            `;
            iframeHead.appendChild(fontOverride);
          }
        }
      }
    };

    // 1. Sync theme immediately
    syncTheme();

    // 2. Observe changes to document.documentElement class list (parent theme changes)
    const docObserver = new MutationObserver(() => {
      syncTheme();
    });
    docObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // 3. Observe body changes (for iframe insertion/re-render by Puck)
    const bodyObserver = new MutationObserver(() => {
      syncTheme();
    });
    bodyObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      docObserver.disconnect();
      bodyObserver.disconnect();
    };
  });

  function toChange(nextData: VmuFitPageBuilderData): PuckPageBuilderChange {
    return {
      data: clonePuckPageData(nextData),
      format: getPuckPageContentFormat(),
      isEmpty: isEmptyPuckPageData(nextData),
      json: serializePuckPageData(nextData),
    };
  }

  function emit(
    callback: ((value: PuckPageBuilderChange) => void) | undefined,
    nextData: VmuFitPageBuilderData,
  ): void {
    callback?.(toChange(nextData));
  }

  function handleSave(nextData: VmuFitPageBuilderData): void {
    emit(onSave, nextData);
    emit(onPublish, nextData);
  }

  return (
    <div
      className={twMerge(
        "vmu-puck-page-builder",
        className,
      )}
    >
      <style>{puckBuilderStyles}</style>

      <Puck
        key={editorKey}
        config={vmuFitPageBuilderConfig}
        data={initialData}
        headerTitle={headerTitle}
        onChange={(nextData) => {
          emit(onChange, nextData);
        }}
        onPublish={handleSave}
        overrides={{
          fieldTypes: {
            select: PuckSelectField,
          },
          headerActions: () => (
            <PuckPageBuilderHeaderActions
              backHref={backHref}
              backLabel={backLabel}
              canSave={canSave}
              isSaving={isSaving}
              onSave={handleSave}
            />
          ),
        }}
      />
    </div>
  );
}

function PuckPageBuilderHeaderActions({
  backHref,
  backLabel,
  canSave,
  isSaving,
  onSave,
}: {
  backHref?: string;
  backLabel: string;
  canSave: boolean;
  isSaving: boolean;
  onSave: (value: VmuFitPageBuilderData) => void;
}) {
  const getPuck = useGetPuck();
  const hasPast = usePageBuilderPuck((state) => state.history.hasPast);
  const hasFuture = usePageBuilderPuck((state) => state.history.hasFuture);
  const goBack = usePageBuilderPuck((state) => state.history.back);
  const goForward = usePageBuilderPuck((state) => state.history.forward);

  return (
    <div className="flex items-center gap-2">
      <Button
        aria-label="Hoàn tác"
        intent="outline"
        isCircle
        isDisabled={!hasPast}
        onPress={() => {
          goBack();
        }}
        size="sm"
      >
        <ArrowUturnLeftIcon className="size-4" />
      </Button>

      <Button
        aria-label="Làm lại"
        intent="outline"
        isCircle
        isDisabled={!hasFuture}
        onPress={() => {
          goForward();
        }}
        size="sm"
      >
        <ArrowUturnRightIcon className="size-4" />
      </Button>

      <Button
        isDisabled={!canSave || isSaving}
        onPress={() => {
          const nextData = getPuck().appState.data as VmuFitPageBuilderData;

          onSave(nextData);
        }}
        size="sm"
      >
        <CheckIcon className="size-4" />
        {isSaving ? "Đang lưu" : "Lưu"}
      </Button>
    </div>
  );
}

const puckBuilderStyles = `
.vmu-puck-page-builder,
.vmu-puck-page-builder button,
.vmu-puck-page-builder input,
.vmu-puck-page-builder select,
.vmu-puck-page-builder textarea,
.vmu-puck-page-builder div,
.vmu-puck-page-builder p,
.vmu-puck-page-builder h1,
.vmu-puck-page-builder h2,
.vmu-puck-page-builder h3,
.vmu-puck-page-builder h4,
.vmu-puck-page-builder span,
.vmu-puck-page-builder label,
.vmu-puck-page-builder a {
  font-family: "Google Sans", var(--font-sans), sans-serif !important;
}

.vmu-puck-page-builder {
  --puck-color-brand: var(--primary, oklch(0.685 0.169 237.323));
  --puck-color-brand-active: var(--primary, oklch(0.685 0.169 237.323));
  --puck-color-brand-hover: var(--primary, oklch(0.685 0.169 237.323));
}

.vmu-puck-page-builder [data-puck-entry] {
  min-height: 100%;
}

.vmu-puck-page-builder [class*="_PuckHeader_"] {
  border-bottom: 1px solid color-mix(in oklch, var(--color-border) 85%, transparent);
  background: var(--color-overlay, #fff);
}

.vmu-puck-page-builder [class*="_PuckHeader-inner_"] {
  min-height: 4.5rem;
  padding-inline: 1.25rem;
}

.vmu-puck-page-builder [class*="_PuckLayout-inner_"] {
  min-height: calc(100vh - 11rem);
  background:
    radial-gradient(circle at top left, color-mix(in oklch, var(--color-primary) 10%, var(--color-bg)) 0%, transparent 32%),
    linear-gradient(180deg, color-mix(in oklch, var(--color-muted) 55%, var(--color-bg)) 0%, var(--color-bg) 18rem);
}

.vmu-puck-page-builder [class*="_PuckFields_"] {
  border-left: 1px solid color-mix(in oklch, var(--color-border) 85%, transparent);
  background: var(--color-overlay, #fff);
}

.vmu-puck-page-builder [class*="_MenuBar-history_"] {
  display: none;
}

.vmu-puck-page-builder [class*="_PuckHeader-leftSideBarToggle_"],
.vmu-puck-page-builder [class*="_PuckHeader-rightSideBarToggle_"] {
  color: var(--color-fg, #0f172a);
}

.vmu-puck-page-builder [class*="_PuckFields-field_"] {
  padding-inline: 1rem;
}

.vmu-puck-page-builder [data-slot="button"] svg {
  flex: none;
}

.vmu-puck-page-builder [class*="_SidebarSection-breadcrumbs_"] {
  display: flex;
  flex-wrap: wrap;
}

@media (max-width: 1023px) {
  .vmu-puck-page-builder [class*="_PuckLayout-inner_"] {
    min-height: calc(100vh - 9rem);
  }
}
`;
