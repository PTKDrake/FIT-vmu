import "@puckeditor/core/puck.css";
import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { usePage } from "@inertiajs/react";
import type { Permissions } from "@puckeditor/core";
import { Puck, createUsePuck, useGetPuck } from "@puckeditor/core";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
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
import { PuckSelectField } from "./puck-select-field";

const useLayoutBuilderPuck = createUsePuck<PageBuilderConfig>();

export interface PuckLayoutBuilderChange {
  data: VmuFitPageBuilderData;
  isEmpty: boolean;
  json: string;
}

interface PuckLayoutBuilderProps {
  className?: string;
  config: PageBuilderConfig;
  content?: VmuFitPageBuilderValue;
  editorKey: string;
  headerTitle: string;
  isSaving?: boolean;
  normalizeData?: (value: VmuFitPageBuilderData) => VmuFitPageBuilderData;
  onChange?: (value: PuckLayoutBuilderChange) => void;
  onSave?: (value: PuckLayoutBuilderChange) => void;
  permissions?: Permissions;
}

export function PuckLayoutBuilder({
  className,
  config,
  content,
  editorKey,
  headerTitle,
  isSaving = false,
  normalizeData,
  onChange,
  onSave,
  permissions = {
    drag: true,
    duplicate: true,
    delete: true,
    edit: true,
    insert: true,
  },
}: PuckLayoutBuilderProps) {
  const [editorRevision, setEditorRevision] = useState(0);
  const dynamicData = usePage<{ dynamicData?: Record<string, unknown> }>().props
    .dynamicData;
  const initialData = parsePuckLayoutData(content);

  useMountEffect(() => {
    if (typeof window === "undefined" || !dynamicData) {
      return;
    }

    const currentWindow = window as Window & {
      __VMU_PUCK_DYNAMIC_DATA__?: Record<string, unknown>;
    };
    currentWindow.__VMU_PUCK_DYNAMIC_DATA__ = dynamicData;

    try {
      const topWindow = window.top as Window & {
        __VMU_PUCK_DYNAMIC_DATA__?: Record<string, unknown>;
      } | null;

      if (topWindow) {
        topWindow.__VMU_PUCK_DYNAMIC_DATA__ = dynamicData;
      }
    } catch {
      // Ignore cross-window access failures. The current window fallback is enough.
    }
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
    callback?.(toChange(nextData));
  }

  function normalize(nextData: VmuFitPageBuilderData): VmuFitPageBuilderData {
    return normalizeData ? normalizeData(nextData) : nextData;
  }

  function handleDataChange(
    callback: ((value: PuckLayoutBuilderChange) => void) | undefined,
    nextData: VmuFitPageBuilderData,
  ): void {
    const normalizedData = normalize(nextData);
    const rawJson = serializePuckPageData(nextData);
    const normalizedJson = serializePuckPageData(normalizedData);

    if (rawJson !== normalizedJson) {
      setEditorRevision((currentRevision) => currentRevision + 1);
    }

    emit(callback, normalizedData);
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
        key={`${editorKey}:${editorRevision}`}
        config={config}
        data={initialData}
        headerTitle={headerTitle}
        onChange={(nextData) => handleDataChange(onChange, nextData)}
        onPublish={(nextData) => handleDataChange(onSave, nextData)}
        overrides={{
          fieldTypes: {
            select: PuckSelectField,
          },
          headerActions: () => (
            <PuckLayoutBuilderHeaderActions
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
  isSaving,
  normalizeData,
  onSave,
}: {
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
`;
