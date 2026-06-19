import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import { twMerge } from "tailwind-merge";
import { useTheme } from "@/hooks/use-theme";
import { parseBlockNoteContent } from "./blocknote-parse";
import { blockNoteSchema } from "./blocknote-schema";
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
  const { resolvedTheme } = useTheme();
  const editor = useCreateBlockNote(
    {
      defaultStyles: true,
      initialContent: parseBlockNoteContent(content),
      schema: blockNoteSchema,
    },
    [editorKey],
  );

  return (
    <div
      className={twMerge(
        "vmu-blocknote vmu-blocknote--readonly overflow-hidden bg-bg text-fg",
        className,
      )}
    >
      <BlockNoteView
        key={editorKey}
        className="vmu-blocknote__view"
        editor={editor}
        theme={resolvedTheme}
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
