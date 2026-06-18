import { useBlockNoteEditor } from "@blocknote/react";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { MediaLibrarySelector } from "@/components/cms/media-selector";
import type { CmsMediaItem } from "@/components/cms/media-selector";
import { Button } from "@/components/ui/button";

interface BlockNoteMediaFilePanelProps {
  blockId: string;
  onSelect?: () => void;
}

export function BlockNoteMediaFilePanel({
  blockId,
  onSelect,
}: BlockNoteMediaFilePanelProps) {
  const editor = useBlockNoteEditor();
  const block = editor.getBlock(blockId);
  const props = (block?.props ?? {}) as {
    name?: string;
    url?: string;
  };

  function handleChange(media: CmsMediaItem | null): void {
    if (!media) {
      return;
    }

    editor.updateBlock(blockId, {
      props: {
        url: media.previewUrl,
        name: media.displayName,
        showPreview: true,
      },
    } as any);
    onSelect?.();
  }

  return (
    <div className="w-80 max-w-[calc(100vw-2rem)] space-y-3 rounded-xl border border-border bg-overlay p-3 shadow-lg">
      <MediaLibrarySelector
        value={
          props.url
            ? {
                id: 0,
                displayName: props.name || "Ảnh đã chọn",
                previewUrl: props.url,
                mimeType: "image/jpeg",
              }
            : null
        }
        onChange={handleChange}
        label="Ảnh nội dung"
        emptyTitle="Chọn ảnh từ thư viện CMS"
        modalTitle="Chọn ảnh cho nội dung"
        removeMessage="Không thể gỡ ảnh từ bảng này."
        selectMessage="Đã chèn ảnh từ thư viện CMS."
        uploadMessage="Đã tải lên và chèn ảnh thành công."
      />
      <Button
        type="button"
        intent="outline"
        size="sm"
        onPress={() => {
          editor.updateBlock(blockId, {
            props: {
              url: "",
              name: "",
            },
          } as any);
        }}
      >
        <PhotoIcon className="size-4" />
        Gỡ ảnh
      </Button>
    </div>
  );
}
