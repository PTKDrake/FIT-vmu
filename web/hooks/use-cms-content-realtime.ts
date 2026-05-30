import { echo } from "@/lib/echo";
import { useMountEffect } from "@/hooks/use-mount-effect";

export type CmsContentChangedPayload = {
  action: string;
  message: string;
  record_id: number;
  resource: "pages" | "posts" | "staff-profiles" | "units";
  status: string;
  title: string;
  updated_at: string;
};

export function useCmsContentRealtime(
  resource: CmsContentChangedPayload["resource"],
  onChange: (payload: CmsContentChangedPayload) => void,
): void {
  useMountEffect(() => {
    const currentEcho = echo;

    if (!currentEcho) {
      return;
    }

    const channelName = `cms.${resource}`;
    const channel = currentEcho.private(channelName);
    const handleContentChanged = (payload: CmsContentChangedPayload) => {
      onChange(payload);
    };

    channel.listen(".CmsContentChanged", handleContentChanged);

    return () => {
      channel.stopListening(".CmsContentChanged", handleContentChanged);
      currentEcho.leave(channelName);
    };
  });
}
