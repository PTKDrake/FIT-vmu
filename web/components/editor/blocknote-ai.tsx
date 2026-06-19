import { FormattingToolbarExtension } from "@blocknote/core/extensions";
import {
  FormattingToolbarController,
  SuggestionMenuController,
  useComponentsContext,
  useBlockNoteEditor,
  useExtension,
} from "@blocknote/react";
import {
  AIExtension,
  AIMenu,
  AIMenuController,
  getAISlashMenuItems,
  type AIMenuProps,
} from "@blocknote/xl-ai";
import { Sparkles } from "lucide-react";
import { BlockNoteFormattingToolbar } from "./blocknote-formatting-toolbar";
import {
  blockNoteSchema,
  getBlockNoteSlashMenuItems,
} from "./blocknote-schema";

let blockNoteAiPromptTarget: "cursor" | "selection" = "selection";

function BlockNoteAiFormattingToolbar() {
  return (
    <BlockNoteFormattingToolbar>
      <BlockNoteAiToolbarButton key="ai-toolbar-button" />
    </BlockNoteFormattingToolbar>
  );
}

function BlockNoteAiToolbarButton() {
  const editor = useBlockNoteEditor(blockNoteSchema);
  const ai = useExtension(AIExtension);
  const components = useComponentsContext();
  const formattingToolbar = useExtension(FormattingToolbarExtension);

  if (!editor.isEditable || !components) {
    return null;
  }

  const ToolbarButton = components.Generic.Toolbar.Button;

  return (
    <ToolbarButton
      className="bn-button"
      icon={<Sparkles size={18} />}
      label="AI"
      mainTooltip="AI"
      onClick={() => {
        const selection = editor.getSelection();

        if (!selection) {
          return;
        }

        blockNoteAiPromptTarget = "selection";
        ai.openAIMenuAtBlock(
          selection.blocks.at(-1)?.id ?? selection.blocks[0].id,
        );
        formattingToolbar.store.setState(false);
      }}
    />
  );
}

function BlockNoteAiMenu(props: AIMenuProps) {
  const editor = useBlockNoteEditor(blockNoteSchema);
  const ai = useExtension(AIExtension);

  return (
    <AIMenu
      {...props}
      onManualPromptSubmit={async (userPrompt) => {
        const useSelection =
          blockNoteAiPromptTarget === "selection" &&
          editor.getSelection() !== undefined;

        blockNoteAiPromptTarget = "selection";

        await ai.invokeAI({
          userPrompt,
          useSelection,
        });
      }}
    />
  );
}

export function BlockNoteAiControllers() {
  const editor = useBlockNoteEditor(blockNoteSchema);

  return (
    <>
      <FormattingToolbarController
        formattingToolbar={BlockNoteAiFormattingToolbar}
      />
      <SuggestionMenuController
        triggerCharacter="/"
        getItems={async (query) =>
          getBlockNoteSlashMenuItems(
            editor,
            query,
            getAISlashMenuItems(editor).map((item) => {
              const itemKey = (item as { key?: string }).key;

              if (itemKey !== "ai") {
                return item;
              }

              return {
                ...item,
                onItemClick: () => {
                  const ai = editor.getExtension(AIExtension);

                  if (!ai) {
                    return;
                  }

                  blockNoteAiPromptTarget = "cursor";
                  const cursor = editor.getTextCursorPosition();
                  const blockId =
                    Array.isArray(cursor.block.content) &&
                    cursor.block.content.length === 0 &&
                    cursor.prevBlock
                      ? cursor.prevBlock.id
                      : cursor.block.id;

                  ai.openAIMenuAtBlock(blockId);
                },
              };
            }),
          )
        }
      />
      <AIMenuController
        aiMenu={BlockNoteAiMenu}
        floatingUIOptions={{
          elementProps: {
            className: "vmu-blocknote-ai-popover",
          },
        }}
      />
    </>
  );
}
