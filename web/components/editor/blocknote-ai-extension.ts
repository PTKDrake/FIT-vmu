import { AIExtension } from "@blocknote/xl-ai";
import { DefaultChatTransport } from "ai";
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
