import { BlockNoteView } from "@blocknote/shadcn";
import { useCreateBlockNote } from "@blocknote/react";
import { twMerge } from "tailwind-merge";
import {
  cloneBlockNoteContent,
  getBlockNoteFormat,
  isEmptyBlockNoteContent,
  parseBlockNoteContent,
  serializeBlockNoteContent,
} from "./blocknote-parse";
import type { BlockNoteContent, BlockNoteValue } from "./blocknote-types";

export interface BlockNoteEditorChange {
  blocks: BlockNoteContent;
  format: "blocknote_json";
  isEmpty: boolean;
  json: string;
}

export interface BlockNoteEditorProps {
  className?: string;
  content?: BlockNoteValue;
  disabled?: boolean;
  editorKey?: string | number;
  onChange?: (value: BlockNoteEditorChange) => void;
  readOnly?: boolean;
  uploadFile?: (
    file: File,
    blockId?: string,
  ) => Promise<string | Record<string, unknown>>;
}

export function BlockNoteEditor({
  className,
  content,
  disabled = false,
  editorKey,
  onChange,
  readOnly = false,
  uploadFile,
}: BlockNoteEditorProps) {
  const initialContent = parseBlockNoteContent(content);
  const isEditable = !disabled && !readOnly;
  const editor = useCreateBlockNote(
    {
      defaultStyles: true,
      initialContent,
      uploadFile,
    },
    [editorKey],
  );

  function handleChange(): void {
    const blocks = cloneBlockNoteContent(editor.document);

    onChange?.({
      blocks,
      format: getBlockNoteFormat(),
      isEmpty: isEmptyBlockNoteContent(blocks),
      json: serializeBlockNoteContent(blocks),
    });
  }

  return (
    <div
      className={twMerge(
        "vmu-blocknote overflow-hidden rounded-xl border border-input bg-overlay text-fg shadow-xs transition-colors",
        isEditable
          ? "focus-within:border-ring/70 focus-within:ring-3 focus-within:ring-ring/20"
          : "",
        className,
      )}
    >
      <BlockNoteView
        key={editorKey}
        className="vmu-blocknote__view"
        editor={editor}
        editable={isEditable}
        emojiPicker={isEditable}
        filePanel={isEditable}
        formattingToolbar={isEditable}
        linkToolbar={isEditable}
        onChange={handleChange}
        sideMenu={isEditable}
        slashMenu={isEditable}
        tableHandles={isEditable}
      />
    </div>
  );
}
