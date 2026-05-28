import {
  AIExtension,
  AIMenuController,
  AIToolbarButton,
  getAISlashMenuItems,
} from "@blocknote/xl-ai";
import { filterSuggestionItems } from "@blocknote/core/extensions";
import { DefaultChatTransport } from "ai";
import {
  FormattingToolbar,
  FormattingToolbarController,
  getDefaultReactSlashMenuItems,
  getFormattingToolbarItems,
  SuggestionMenuController,
  useBlockNoteEditor,
} from "@blocknote/react";
import aiRoutes from "@/routes/cms/ai";

export function createBlockNoteAiExtension() {
  return AIExtension({
    transport: new DefaultChatTransport({
      api: aiRoutes.blocknote.url(),
      credentials: "same-origin",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    }),
  });
}

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
