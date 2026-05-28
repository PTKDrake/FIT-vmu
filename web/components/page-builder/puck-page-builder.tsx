
import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { router } from "@inertiajs/react";
import {
  Puck,
  createUsePuck,
  useGetPuck,
} from "@puckeditor/core";
import { twMerge } from "tailwind-merge";
import { Button } from "@/components/ui/button";
import { useMountEffect } from "@/hooks/use-mount-effect";
import { vmuFitPageBuilderConfig } from "@/lib/puck/page-builder-config";
import {
  clonePuckPageData,
  getPuckPageContentFormat,
  isEmptyPuckPageData,
  parsePuckPageData,
  serializePuckPageData


} from "@/lib/puck/page-builder-data";
import type { VmuFitPageBuilderData, VmuFitPageBuilderValue } from "@/lib/puck/page-builder-data";

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
      const iframe = document.querySelector(".vmu-puck-page-builder iframe") as HTMLIFrameElement | null;

      if (iframe && iframe.contentDocument) {
        const iframeHtml = iframe.contentDocument.documentElement;

        if (iframeHtml) {
          if (iframeHtml.classList.contains("dark") !== isDark) {
            iframeHtml.classList.toggle("dark", isDark);
            iframeHtml.style.colorScheme = isDark ? "dark" : "light";
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
        "vmu-puck-page-builder overflow-hidden rounded-3xl border border-border shadow-xs",
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

@media (max-width: 1023px) {
  .vmu-puck-page-builder [class*="_PuckLayout-inner_"] {
    min-height: calc(100vh - 9rem);
  }
}
`;
