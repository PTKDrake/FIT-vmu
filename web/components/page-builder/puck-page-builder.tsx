import {
  Puck,
  createUsePuck,
  useGetPuck,
} from "@measured/puck";
import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  CheckIcon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";
import { router } from "@inertiajs/react";
import { twMerge } from "tailwind-merge";
import { Button } from "@/components/ui/button";
import { vmuFitPageBuilderConfig } from "@/lib/puck/page-builder-config";
import {
  clonePuckPageData,
  getPuckPageContentFormat,
  isEmptyPuckPageData,
  parsePuckPageData,
  serializePuckPageData,
  type VmuFitPageBuilderData,
  type VmuFitPageBuilderValue,
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
        "vmu-puck-page-builder overflow-hidden rounded-3xl border border-border bg-overlay shadow-xs",
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

      {backHref ? (
        <Button
          intent="outline"
          onPress={() => {
            router.get(backHref);
          }}
          size="sm"
        >
          <ListBulletIcon className="size-4" />
          {backLabel}
        </Button>
      ) : null}

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
  border-bottom: 1px solid color-mix(in srgb, var(--color-border) 85%, transparent);
  background: var(--color-overlay, #fff);
}

.vmu-puck-page-builder [class*="_PuckHeader-inner_"] {
  min-height: 4.5rem;
  padding-inline: 1.25rem;
}

.vmu-puck-page-builder [class*="_PuckLayout-inner_"] {
  min-height: calc(100vh - 11rem);
  background:
    radial-gradient(circle at top left, color-mix(in srgb, var(--color-primary, #1d4ed8) 10%, white) 0%, transparent 32%),
    linear-gradient(180deg, color-mix(in srgb, var(--color-muted, #f5f5f5) 55%, white) 0%, white 18rem);
}

.vmu-puck-page-builder [class*="_PuckFields_"] {
  border-left: 1px solid color-mix(in srgb, var(--color-border) 85%, transparent);
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
