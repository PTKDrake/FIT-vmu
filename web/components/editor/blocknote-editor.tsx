import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import "@blocknote/xl-ai/style.css";
import { vi as blockNoteViDictionary } from "@blocknote/core/locales";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import { vi as blockNoteAiViDictionary } from "@blocknote/xl-ai/locales";
import { usePage } from "@inertiajs/react";
import { twMerge } from "tailwind-merge";
import { useTheme } from "@/hooks/use-theme";
import type { SharedData } from "@/types/shared";
import { BlockNoteAiControllers } from "./blocknote-ai";
import { createBlockNoteAiExtension } from "./blocknote-ai-extension";
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
  const { resolvedTheme } = useTheme();
  const page = usePage<SharedData>();
  const initialContent = parseBlockNoteContent(content);
  const isEditable = !disabled && !readOnly;
  const blockNoteAiEnabled =
    isEditable && page.props.features.blocknoteAiEnabled;
  const editor = useCreateBlockNote(
    {
      defaultStyles: true,
      dictionary: {
        ...blockNoteViDictionary,
        ai: blockNoteAiViDictionary,
      },
      extensions: blockNoteAiEnabled ? [createBlockNoteAiExtension()] : [],
      initialContent,
      uploadFile,
    },
    [blockNoteAiEnabled, editorKey],
  );

  function handleEditorChange(): void {
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
        theme={resolvedTheme}
        editable={isEditable}
        emojiPicker={isEditable}
        filePanel={isEditable}
        linkToolbar={isEditable}
        onChange={handleEditorChange}
        sideMenu={isEditable}
        slashMenu={blockNoteAiEnabled ? false : isEditable}
        tableHandles={isEditable}
        formattingToolbar={blockNoteAiEnabled ? false : isEditable}
      >
        {blockNoteAiEnabled ? <BlockNoteAiControllers /> : null}
      </BlockNoteView>
    </div>
  );
}
