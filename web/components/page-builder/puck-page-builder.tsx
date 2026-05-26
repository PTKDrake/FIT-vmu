import { Puck } from "@measured/puck";
import { twMerge } from "tailwind-merge";
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

export interface PuckPageBuilderChange {
  data: VmuFitPageBuilderData;
  format: "puck_json";
  isEmpty: boolean;
  json: string;
}

export interface PuckPageBuilderProps {
  className?: string;
  content?: VmuFitPageBuilderValue;
  editorKey?: string | number;
  headerTitle?: string;
  onChange?: (value: PuckPageBuilderChange) => void;
  onPublish?: (value: PuckPageBuilderChange) => void;
}

export function PuckPageBuilder({
  className,
  content,
  editorKey,
  headerTitle = "VMUFit Page Builder",
  onChange,
  onPublish,
}: PuckPageBuilderProps) {
  const initialData = parsePuckPageData(content);

  function emit(
    callback: ((value: PuckPageBuilderChange) => void) | undefined,
    nextData: VmuFitPageBuilderData,
  ): void {
    callback?.({
      data: clonePuckPageData(nextData),
      format: getPuckPageContentFormat(),
      isEmpty: isEmptyPuckPageData(nextData),
      json: serializePuckPageData(nextData),
    });
  }

  return (
    <div
      className={twMerge(
        "vmu-puck-page-builder overflow-hidden rounded-3xl border border-border bg-overlay shadow-xs",
        className,
      )}
    >
      <Puck
        key={editorKey}
        config={vmuFitPageBuilderConfig}
        data={initialData}
        headerTitle={headerTitle}
        onChange={(nextData) => {
          emit(onChange, nextData);
        }}
        onPublish={(nextData) => {
          emit(onPublish, nextData);
        }}
      />
    </div>
  );
}
