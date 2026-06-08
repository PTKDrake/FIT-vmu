import { AIExtension } from "@blocknote/xl-ai";
import { DefaultChatTransport } from "ai";
import aiRoutes from "@/routes/cms/ai";

function csrfToken(): string {
  return (
    document
      .querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
      ?.content.trim() ?? ""
  );
}

export function createBlockNoteAiExtension() {
  return AIExtension({
    transport: new DefaultChatTransport({
      api: aiRoutes.blocknote.url(),
      credentials: "same-origin",
      headers: {
        "X-CSRF-TOKEN": csrfToken(),
        "X-Requested-With": "XMLHttpRequest",
      },
    }),
  });
}
