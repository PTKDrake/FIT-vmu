import "@puckeditor/core/puck.css";
import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { usePage } from "@inertiajs/react";
import { Puck, createUsePuck, useGetPuck } from "@puckeditor/core";
import type { Permissions } from "@puckeditor/core";
import type { Plugin } from "@puckeditor/core";
import { useMemo } from "react";
import { twMerge } from "tailwind-merge";
import { PuckExportMenu } from "@/components/page-builder/puck-export-menu";
import { PuckDrawerItem } from "@/components/puck/puck-drawer-item";
import { Button } from "@/components/ui/button";
import { useMountEffect } from "@/hooks/use-mount-effect";
import type { PageBuilderConfig } from "@/lib/puck/blocks/types";
import {
  clonePuckPageData,
  isEmptyPuckPageData,
  parsePuckLayoutData,
  serializePuckPageData,
} from "@/lib/puck/page-builder-data";
import type {
  VmuFitPageBuilderData,
  VmuFitPageBuilderValue,
} from "@/lib/puck/page-builder-data";
import { PuckDisplayField } from "./puck-display-field";
import { PuckMediaField } from "./puck-media-field";
import { PuckSelectField } from "./puck-select-field";

const useLayoutBuilderPuck = createUsePuck<PageBuilderConfig>();

export interface PuckLayoutBuilderChange {
  data: VmuFitPageBuilderData;
  isEmpty: boolean;
  json: string;
}

interface PuckLayoutBuilderProps {
  canExport?: boolean;
  className?: string;
  config: PageBuilderConfig;
  content?: VmuFitPageBuilderValue;
  editorKey: string;
  exportName?: string;
  headerTitle: string;
  isSaving?: boolean;
  normalizeData?: (value: VmuFitPageBuilderData) => VmuFitPageBuilderData;
  onChange?: (value: PuckLayoutBuilderChange) => void;
  onDirtyChange?: (isDirty: boolean) => void;
  onSave?: (value: PuckLayoutBuilderChange) => void;
  permissions?: Permissions;
  plugins?: Plugin<PageBuilderConfig>[];
}

export function PuckLayoutBuilder({
  canExport = false,
  className,
  config,
  content,
  editorKey,
  exportName = "site-layout",
  headerTitle,
  isSaving = false,
  normalizeData,
  onChange,
  onDirtyChange,
  onSave,
  permissions = {
    drag: true,
    duplicate: true,
    delete: true,
    edit: true,
    insert: true,
  },
  plugins,
}: PuckLayoutBuilderProps) {
  const dynamicData = usePage<{ dynamicData?: Record<string, unknown> }>().props
    .dynamicData;
  const initialData = useMemo(() => parsePuckLayoutData(content), [content]);

  useMountEffect(() => {
    if (typeof window === "undefined" || !dynamicData) {
      return;
    }

    const currentWindow = window as Window & {
      __VMU_PUCK_DYNAMIC_DATA__?: Record<string, unknown>;
    };
    currentWindow.__VMU_PUCK_DYNAMIC_DATA__ = dynamicData;

    try {
      const topWindow = window.top as
        | (Window & {
            __VMU_PUCK_DYNAMIC_DATA__?: Record<string, unknown>;
          })
        | null;

      if (topWindow) {
        topWindow.__VMU_PUCK_DYNAMIC_DATA__ = dynamicData;
      }
    } catch {
      // Ignore cross-window access failures. The current window fallback is enough.
    }
  });

  useMountEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    let frameId: number | null = null;

    const syncPreviewFrameStyles = () => {
      const iframe = document.querySelector(
        ".vmu-puck-page-builder iframe",
      ) as HTMLIFrameElement | null;
      const iframeHead = iframe?.contentDocument?.head;

      if (!iframeHead) {
        return;
      }

      let styleElement = iframeHead.querySelector(
        "#vmu-layout-builder-preview-fixes",
      ) as HTMLStyleElement | null;

      if (!styleElement) {
        styleElement = iframe.contentDocument.createElement("style");
        styleElement.id = "vmu-layout-builder-preview-fixes";
        iframeHead.appendChild(styleElement);
      }

      if (styleElement.textContent !== layoutBuilderPreviewFrameStyles) {
        styleElement.textContent = layoutBuilderPreviewFrameStyles;
      }
    };

    const scheduleSyncPreviewFrameStyles = () => {
      if (frameId !== null) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        syncPreviewFrameStyles();
      });
    };

    syncPreviewFrameStyles();

    const bodyObserver = new MutationObserver(scheduleSyncPreviewFrameStyles);
    bodyObserver.observe(
      document.querySelector(".vmu-puck-page-builder") ?? document.body,
      {
        childList: true,
        subtree: true,
      },
    );

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      bodyObserver.disconnect();
    };
  });

  function toChange(nextData: VmuFitPageBuilderData): PuckLayoutBuilderChange {
    return {
      data: clonePuckPageData(nextData),
      isEmpty: isEmptyPuckPageData(nextData),
      json: serializePuckPageData(nextData),
    };
  }

  function emit(
    callback: ((value: PuckLayoutBuilderChange) => void) | undefined,
    nextData: VmuFitPageBuilderData,
  ): void {
    if (callback === undefined) {
      return;
    }

    callback?.(toChange(nextData));
  }

  function normalize(nextData: VmuFitPageBuilderData): VmuFitPageBuilderData {
    return normalizeData ? normalizeData(nextData) : nextData;
  }

  function handleDataChange(
    callback: ((value: PuckLayoutBuilderChange) => void) | undefined,
    nextData: VmuFitPageBuilderData,
  ): void {
    if (callback === undefined) {
      return;
    }

    emit(callback, normalize(nextData));
  }

  function handleEditorChange(nextData: VmuFitPageBuilderData): void {
    onDirtyChange?.(true);
    handleDataChange(onChange, nextData);
  }

  return (
    <div
      className={twMerge(
        "vmu-puck-page-builder flex min-h-0 flex-1 flex-col overflow-hidden",
        className,
      )}
    >
      <style>{layoutBuilderStyles}</style>
      <Puck
        key={editorKey}
        config={config}
        data={initialData}
        headerTitle={headerTitle}
        onChange={handleEditorChange}
        plugins={plugins}
        overrides={{
          drawerItem: PuckDrawerItem as any,
          fieldTypes: {
            cmsMedia: PuckMediaField,
            displayVisibility: PuckDisplayField,
            select: PuckSelectField,
          } as any,
          headerActions: () => (
            <PuckLayoutBuilderHeaderActions
              canExport={canExport}
              exportName={exportName}
              isSaving={isSaving}
              normalizeData={normalize}
              onSave={(nextData) => handleDataChange(onSave, nextData)}
            />
          ),
        }}
        permissions={permissions}
      />
    </div>
  );
}

function PuckLayoutBuilderHeaderActions({
  canExport,
  exportName,
  isSaving,
  normalizeData,
  onSave,
}: {
  canExport: boolean;
  exportName: string;
  isSaving: boolean;
  normalizeData: (value: VmuFitPageBuilderData) => VmuFitPageBuilderData;
  onSave: (value: VmuFitPageBuilderData) => void;
}) {
  const getPuck = useGetPuck();
  const hasPast = useLayoutBuilderPuck((state) => state.history.hasPast);
  const hasFuture = useLayoutBuilderPuck((state) => state.history.hasFuture);
  const goBack = useLayoutBuilderPuck((state) => state.history.back);
  const goForward = useLayoutBuilderPuck((state) => state.history.forward);

  return (
    <div className="flex items-center gap-2">
      {canExport ? (
        <PuckExportMenu
          exportName={exportName}
          exportTarget="site-layout"
          getData={() =>
            normalizeData(getPuck().appState.data as VmuFitPageBuilderData)
          }
        />
      ) : null}

      <Button
        aria-label="Hoàn tác"
        intent="outline"
        isCircle
        isDisabled={!hasPast}
        onPress={() => goBack()}
        size="sm"
      >
        <ArrowUturnLeftIcon className="size-4" />
      </Button>
      <Button
        aria-label="Làm lại"
        intent="outline"
        isCircle
        isDisabled={!hasFuture}
        onPress={() => goForward()}
        size="sm"
      >
        <ArrowUturnRightIcon className="size-4" />
      </Button>
      <Button
        isDisabled={isSaving}
        onPress={() => {
          const nextData = normalizeData(
            getPuck().appState.data as VmuFitPageBuilderData,
          );

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

const layoutBuilderStyles = `
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

.vmu-puck-page-builder [data-puck-dropzone]:not(:empty) {
  min-height: 0 !important;
  height: auto !important;
}

.vmu-puck-page-builder [data-puck-dropzone]:empty {
  min-height: 5rem;
}

.vmu-puck-page-builder [class*="_PuckHeader_"],
.vmu-puck-page-builder [class*="_PuckFields_"] {
  background: var(--color-overlay, #fff);
}

.vmu-puck-page-builder [class*="_PuckLayout-inner_"] {
  background:
    linear-gradient(180deg, color-mix(in oklch, var(--color-muted) 55%, var(--color-bg)) 0%, var(--color-bg) 18rem);
}

.vmu-puck-page-builder [class*="_MenuBar-history_"] {
  display: none;
}

.vmu-puck-page-builder [class*="_SidebarSection-breadcrumbs_"] {
  display: flex;
  flex-wrap: wrap;
}

.vmu-puck-page-builder [data-puck-component]:has([data-vmu-puck-block="navigation-menu"][data-vmu-navigation-orientation="horizontal"]) {
  width: 100%;
  min-width: fit-content;
  max-width: none;
}

@media (min-width: 48rem) {
  .vmu-puck-page-builder [data-puck-component]:has([data-vmu-puck-block="navigation-menu"][data-vmu-navigation-orientation="horizontal"]) {
    flex-basis: 44rem;
    flex-grow: 1;
  }
}
`;

const layoutBuilderPreviewFrameStyles = `
[data-puck-dropzone]:not(:empty),
[data-puck-dropzone][class*="DropZone--hasChildren"] {
  min-height: 0 !important;
  height: auto !important;
}

[data-puck-dropzone]:empty {
  min-height: 5rem;
}

[data-puck-component]:has([data-vmu-puck-block="navigation-menu"][data-vmu-navigation-orientation="horizontal"]) {
  width: 100%;
  min-width: fit-content;
  max-width: none;
}

@media (min-width: 48rem) {
  [data-puck-component]:has([data-vmu-puck-block="navigation-menu"][data-vmu-navigation-orientation="horizontal"]) {
    flex-basis: 44rem;
    flex-grow: 1;
  }
}
`;
