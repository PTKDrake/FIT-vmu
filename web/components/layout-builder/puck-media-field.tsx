import { createUsePuck } from "@puckeditor/core";
import type { ComponentType, ReactNode } from "react";
import {
  MediaLibrarySelector
  
} from "@/components/cms/media-selector";
import type {CmsMediaItem} from "@/components/cms/media-selector";
import {
  createPuckMediaReference,
  getPuckImageUrl,
  getPuckMediaDisplayName,
  getPuckMediaId
  
} from "@/lib/puck/media";
import type {PuckImageValue} from "@/lib/puck/media";

interface PuckLabelProps {
  children: ReactNode;
  icon?: ReactNode;
  label: string;
  readOnly?: boolean;
}

interface PuckMediaFieldProps {
  Label?: ComponentType<PuckLabelProps>;
  field: {
    label?: string;
  };
  label?: string;
  labelIcon?: ReactNode;
  name: string;
  onChange: (value: PuckImageValue) => void;
  readOnly?: boolean;
}

const usePuck = createUsePuck();

function getDeep(node: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc == null || typeof acc !== "object") {
      return undefined;
    }

    return (acc as Record<string, unknown>)[key];
  }, node);
}

export function PuckMediaField({
  Label,
  field,
  label,
  labelIcon,
  name,
  onChange,
  readOnly,
}: PuckMediaFieldProps) {
  const value = usePuck((state) => {
    const props = state.selectedItem?.props ?? state.appState.data.root.props;

    return getDeep(props, name) as PuckImageValue;
  });
  const displayLabel = label ?? field.label ?? name;
  const mediaId = getPuckMediaId(value);
  const selectorValue =
    mediaId === null
      ? null
      : {
          id: mediaId,
          displayName: getPuckMediaDisplayName(value) ?? "Ảnh đã chọn",
          previewUrl: getPuckImageUrl(value) || `/storage/media/${mediaId}`,
          mimeType: typeof value === "object" && value?.mimeType
            ? value.mimeType
            : "image/jpeg",
        };

  function handleChange(media: CmsMediaItem | null): void {
    onChange(media ? createPuckMediaReference(media) : null);
  }

  const selector = readOnly ? (
    <div className="rounded-lg border border-border bg-muted/20 px-3 py-2 text-xs text-muted-fg">
      {selectorValue?.displayName ?? "Không có ảnh"}
    </div>
  ) : (
    <MediaLibrarySelector
      value={selectorValue}
      onChange={handleChange}
      label={displayLabel}
      emptyTitle="Chọn ảnh"
      modalTitle="Chọn ảnh từ thư viện CMS"
      removeMessage="Đã gỡ bỏ ảnh."
      selectMessage="Đã chọn ảnh từ thư viện."
      showLabel={!Label}
      uploadMessage="Đã tải lên và áp dụng ảnh thành công."
    />
  );

  if (Label) {
    return (
      <Label icon={labelIcon} label={displayLabel} readOnly={readOnly}>
        {selector}
      </Label>
    );
  }

  return selector;
}
