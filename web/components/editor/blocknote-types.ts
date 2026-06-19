import type { Block, PartialBlock } from "@blocknote/core";
import type {
  VmuBlockSchema,
  VmuInlineContentSchema,
  VmuStyleSchema,
} from "./blocknote-schema";

export type BlockNoteContent = Block<
  VmuBlockSchema,
  VmuInlineContentSchema,
  VmuStyleSchema
>[];
export type BlockNoteInitialContent = PartialBlock<
  VmuBlockSchema,
  VmuInlineContentSchema,
  VmuStyleSchema
>[];
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
