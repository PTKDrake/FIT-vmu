import type { Block, PartialBlock } from "@blocknote/core";

export type BlockNoteContent = Block[];
export type BlockNoteInitialContent = PartialBlock[];
export type BlockNoteFormat = "blocknote_json";
export type BlockNoteValue =
  | BlockNoteContent
  | BlockNoteInitialContent
  | string
  | null
  | undefined;

export const BLOCKNOTE_FORMAT: BlockNoteFormat = "blocknote_json";

export const EMPTY_BLOCKNOTE_CONTENT = [
  {
    type: "paragraph",
    content: "",
  },
] satisfies BlockNoteInitialContent;
