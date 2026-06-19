import {
  type BlockNoteEditor,
  BlockNoteSchema,
  combineByGroup,
} from "@blocknote/core";
import { filterSuggestionItems } from "@blocknote/core/extensions";
import {
  getDefaultReactSlashMenuItems,
  type DefaultReactSuggestionItem,
} from "@blocknote/react";
import {
  getMultiColumnSlashMenuItems,
  locales as multiColumnLocales,
  multiColumnDropCursor,
  withMultiColumn,
} from "@blocknote/xl-multi-column";

export const blockNoteSchema = withMultiColumn(BlockNoteSchema.create());

export type VmuBlockNoteSchema = typeof blockNoteSchema;
export type VmuBlockSchema = VmuBlockNoteSchema["blockSchema"];
export type VmuInlineContentSchema = VmuBlockNoteSchema["inlineContentSchema"];
export type VmuStyleSchema = VmuBlockNoteSchema["styleSchema"];

export const blockNoteMultiColumnDictionary = {
  multi_column: multiColumnLocales.vi,
};

export { multiColumnDropCursor };

export async function getBlockNoteSlashMenuItems(
  editor: BlockNoteEditor<
    VmuBlockSchema,
    VmuInlineContentSchema,
    VmuStyleSchema
  >,
  query: string,
  leadingItems: DefaultReactSuggestionItem[] = [],
): Promise<DefaultReactSuggestionItem[]> {
  return filterSuggestionItems(
    combineByGroup(
      leadingItems,
      getDefaultReactSlashMenuItems(editor),
      getMultiColumnSlashMenuItems(editor),
    ),
    query,
  );
}
