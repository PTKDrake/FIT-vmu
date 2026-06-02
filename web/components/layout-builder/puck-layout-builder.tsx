import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { Puck, createUsePuck, useGetPuck } from "@puckeditor/core";
import { twMerge } from "tailwind-merge";
import { Button } from "@/components/ui/button";
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
  onChange?: (value: PuckLayoutBuilderChange) => void;
  onSave?: (value: PuckLayoutBuilderChange) => void;
}

export function PuckLayoutBuilder({
  className,
  config,
  content,
  editorKey,
  headerTitle,
  isSaving = false,
  onChange,
  onSave,
}: PuckLayoutBuilderProps) {
  const initialData = parsePuckLayoutData(content);

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

  return (
    <div
      className={twMerge(
        "vmu-puck-page-builder overflow-hidden rounded-2xl border border-border shadow-xs",
        className,
      )}
    >
      <style>{layoutBuilderStyles}</style>
      <Puck
        key={editorKey}
        config={config}
        data={initialData}
        headerTitle={headerTitle}
        onChange={(nextData) => emit(onChange, nextData)}
        onPublish={(nextData) => emit(onSave, nextData)}
        overrides={{
          headerActions: () => (
            <PuckLayoutBuilderHeaderActions
              isSaving={isSaving}
              onSave={(nextData) => emit(onSave, nextData)}
            />
          ),
        }}
      />
    </div>
  );
}

function PuckLayoutBuilderHeaderActions({
  isSaving,
  onSave,
}: {
  isSaving: boolean;
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
  min-height: 42rem;
  background:
    linear-gradient(180deg, color-mix(in oklch, var(--color-muted) 55%, var(--color-bg)) 0%, var(--color-bg) 18rem);
}

.vmu-puck-page-builder [class*="_MenuBar-history_"] {
  display: none;
}
`;
