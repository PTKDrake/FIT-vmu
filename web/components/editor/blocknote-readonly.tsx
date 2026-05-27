import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import { twMerge } from "tailwind-merge";
import { parseBlockNoteContent } from "./blocknote-parse";
import type { BlockNoteValue } from "./blocknote-types";

interface BlockNoteReadonlyProps {
  className?: string;
  content?: BlockNoteValue;
  editorKey?: string | number;
}

export function BlockNoteReadonly({
  className,
  content,
  editorKey,
}: BlockNoteReadonlyProps) {
  const editor = useCreateBlockNote(
    {
      defaultStyles: true,
      initialContent: parseBlockNoteContent(content),
    },
    [editorKey],
  );

  return (
    <div
      className={twMerge(
        "vmu-blocknote vmu-blocknote--readonly overflow-hidden rounded-xl border border-border bg-bg text-fg",
        className,
      )}
    >
      <BlockNoteView
        key={editorKey}
        className="vmu-blocknote__view"
        editor={editor}
        editable={false}
        emojiPicker={false}
        filePanel={false}
        formattingToolbar={false}
        linkToolbar={false}
        sideMenu={false}
        slashMenu={false}
        tableHandles={false}
      />
    </div>
  );
}
