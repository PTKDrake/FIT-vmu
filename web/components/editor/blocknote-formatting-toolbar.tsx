import { PhotoIcon } from "@heroicons/react/24/outline";
import {
  FormattingToolbar,
  getFormattingToolbarItems,
  useBlockNoteEditor,
  useComponentsContext,
  useEditorState,
} from "@blocknote/react";
import type { ReactNode } from "react";
import { useState } from "react";
import { BlockNoteMediaFilePanel } from "./blocknote-media-file-panel";

interface BlockNoteFormattingToolbarProps {
  children?: ReactNode;
}

export function BlockNoteFormattingToolbar({
  children,
}: BlockNoteFormattingToolbarProps) {
  return (
    <FormattingToolbar>
      {getBlockNoteFormattingToolbarItems()}
      {children}
    </FormattingToolbar>
  );
}

export function getBlockNoteFormattingToolbarItems(): ReactNode[] {
  const items = getFormattingToolbarItems();
  const replaceButtonIndex = items.findIndex((item) =>
    String(item.key).includes("replaceFileButton"),
  );
  const filteredItems = items.filter(
    (item) => !String(item.key).includes("replaceFileButton"),
  );
  const insertIndex = replaceButtonIndex >= 0 ? replaceButtonIndex : 3;

  filteredItems.splice(
    insertIndex,
    0,
    <BlockNoteMediaReplaceButton key="cmsMediaReplaceButton" />,
  );

  return filteredItems;
}

function BlockNoteMediaReplaceButton() {
  const components = useComponentsContext();
  const editor = useBlockNoteEditor();
  const [isOpen, setIsOpen] = useState(false);
  const selectedBlock = useEditorState({
    editor,
    on: "selection",
    selector: ({ editor }) => {
      if (!editor.isEditable) {
        return undefined;
      }

      const blocks = editor.getSelection()?.blocks ?? [
        editor.getTextCursorPosition().block,
      ];

      if (blocks.length !== 1) {
        return undefined;
      }

      const block = blocks[0] as {
        id: string;
        props?: {
          url?: unknown;
        };
        type: string;
      };

      return typeof block.props?.url === "string" ? block : undefined;
    },
  });

  if (!components) {
    return null;
  }

  if (!selectedBlock) {
    return null;
  }

  return (
    <components.Generic.Popover.Root
      open={isOpen}
      onOpenChange={setIsOpen}
      position="bottom"
    >
      <components.Generic.Popover.Trigger>
        <components.FormattingToolbar.Button
          className="bn-button"
          icon={<PhotoIcon />}
          label="Thay thế ảnh từ thư viện CMS"
          mainTooltip="Thay thế ảnh từ thư viện CMS"
        />
      </components.Generic.Popover.Trigger>
      <components.Generic.Popover.Content
        className="bn-popover-content bn-panel-popover vmu-blocknote-media-popover"
        variant="panel-popover"
      >
        <BlockNoteMediaFilePanel
          blockId={selectedBlock.id}
          onSelect={() => setIsOpen(false)}
        />
      </components.Generic.Popover.Content>
    </components.Generic.Popover.Root>
  );
}
