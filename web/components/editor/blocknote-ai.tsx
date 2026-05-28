import { filterSuggestionItems } from "@blocknote/core/extensions";
import {
  FormattingToolbar,
  FormattingToolbarController,
  getDefaultReactSlashMenuItems,
  getFormattingToolbarItems,
  SuggestionMenuController,
  useBlockNoteEditor,
} from "@blocknote/react";
import {
  AIMenuController,
  AIToolbarButton,
  getAISlashMenuItems,
} from "@blocknote/xl-ai";

function BlockNoteAiFormattingToolbar() {
  return (
    <FormattingToolbar>
      {[
        ...getFormattingToolbarItems(),
        <AIToolbarButton key="ai-toolbar-button" />,
      ]}
    </FormattingToolbar>
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
