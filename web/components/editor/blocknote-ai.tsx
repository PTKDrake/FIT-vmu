import { filterSuggestionItems } from "@blocknote/core/extensions";
import {
  FormattingToolbarController,
  getDefaultReactSlashMenuItems,
  SuggestionMenuController,
  useBlockNoteEditor,
} from "@blocknote/react";
import {
  AIMenuController,
  AIToolbarButton,
  getAISlashMenuItems,
} from "@blocknote/xl-ai";
import { BlockNoteFormattingToolbar } from "./blocknote-formatting-toolbar";

function BlockNoteAiFormattingToolbar() {
  return (
    <BlockNoteFormattingToolbar>
      <AIToolbarButton key="ai-toolbar-button" />
    </BlockNoteFormattingToolbar>
  );
}

export function BlockNoteAiControllers() {
  const editor = useBlockNoteEditor();

  return (
    <>
      <FormattingToolbarController
        formattingToolbar={BlockNoteAiFormattingToolbar}
      />
      <SuggestionMenuController
        triggerCharacter="/"
        getItems={async (query) =>
          filterSuggestionItems(
            [
              ...getDefaultReactSlashMenuItems(editor),
              ...getAISlashMenuItems(editor),
            ],
            query,
          )
        }
      />
      <AIMenuController />
    </>
  );
}
