import { useMountEffect } from "@/hooks/use-mount-effect";
import { loadEcho } from "@/lib/load-echo";

export type CmsContentChangedPayload = {
  action: string;
  message: string;
  record_id: number;
  resource:
    | "layouts"
    | "media"
    | "navigation"
    | "pages"
    | "positions"
    | "post-categories"
    | "posts"
    | "roles"
    | "settings"
    | "staff-profiles"
    | "student-groups"
    | "units"
    | "users";
  status: string;
  title: string;
  updated_at: string;
};

export function useCmsContentRealtime(
  resource: CmsContentChangedPayload["resource"],
  onChange: (payload: CmsContentChangedPayload) => void,
): void {
  useMountEffect(() => {
    let isActive = true;
    let unsubscribe: (() => void) | undefined;

    void loadEcho().then(({ echo }) => {
      if (!isActive || !echo) {
        return;
      }

      const channelName = `cms.${resource}`;
      const channel = echo.private(channelName);
      const handleContentChanged = (payload: CmsContentChangedPayload) => {
        onChange(payload);
      };

      channel.listen(".CmsContentChanged", handleContentChanged);

      unsubscribe = () => {
        channel.stopListening(".CmsContentChanged", handleContentChanged);
        echo.leave(channelName);
      };
    });

    return () => {
      isActive = false;
      unsubscribe?.();
    };
  });
}
