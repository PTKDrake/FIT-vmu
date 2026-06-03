import { usePage } from "@inertiajs/react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { t } from "@/lib/i18n";
import { useMountEffect } from "@/hooks/use-mount-effect";
import { echo } from "@/lib/echo";
import realtimeRoutes from "@/routes/cms/realtime";
import type { SharedData } from "@/types/shared";

interface CmsRealtimePingPayload {
  message: string;
  sent_at: string;
  user_id: number;
}

const dateTimeFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  month: "2-digit",
  second: "2-digit",
});

function csrfToken(): string {
  return (
    document
      .querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
      ?.content.trim() ?? ""
  );
}

function formatDateTime(value: string): string {
  return dateTimeFormatter.format(new Date(value));
}

export function CmsRealtimeDemoCard() {
  const { auth } = usePage<SharedData>().props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestMessage, setRequestMessage] = useState<string | null>(null);
  const [lastPing, setLastPing] = useState<CmsRealtimePingPayload | null>(null);

  const user = auth.user;
  const channelName = user ? `cms-user.${user.id}` : null;

  useMountEffect(() => {
    const currentEcho = echo;

    if (!currentEcho || !channelName) {
      return;
    }

    const channel = currentEcho.private(channelName);
    const handleRealtimePing = (payload: CmsRealtimePingPayload) => {
      setLastPing(payload);
      toast.success(payload.message);
    };

    channel.listen("CmsRealtimePinged", handleRealtimePing);

    return () => {
      channel.stopListening("CmsRealtimePinged", handleRealtimePing);
      currentEcho.leave(channelName);
    };
  });

  if (!user) {
    return null;
  }

  async function triggerRealtimePing(): Promise<void> {
    setIsSubmitting(true);
    setRequestMessage(null);

    try {
      const response = await fetch(realtimeRoutes.ping.url(), {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken(),
        },
        credentials: "same-origin",
        body: JSON.stringify({}),
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        const message = payload.message ?? "Không thể gửi realtime ping.";

        toast.error(message);
        setRequestMessage(message);
        setIsSubmitting(false);

        return;
      }

      setRequestMessage(
        payload.message ?? "Realtime ping đã được đưa vào hàng đợi.",
      );
      setIsSubmitting(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Không thể gửi realtime ping.";

      toast.error(message);
      setRequestMessage(message);
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="border-border bg-overlay/70">
      <CardHeader>
        <CardTitle>{t("Mẫu realtime")}</CardTitle>
        <CardDescription>
          {t("Kiểm tra kênh riêng Reverb cho tài khoản CMS hiện tại.")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-xl border border-border bg-muted/40 p-4">
          <p className="text-sm font-medium text-fg">{t("Kênh riêng")}</p>
          <Text className="mt-1 font-mono text-xs">{channelName}</Text>
        </div>

        <div className="rounded-xl border border-border bg-muted/40 p-4">
          <p className="text-sm font-medium text-fg">Trạng thái gần nhất</p>
          <Text className="mt-1">
            {lastPing
              ? `${lastPing.message} (${formatDateTime(lastPing.sent_at)})`
              : "Chưa nhận được sự kiện nào trong phiên này."}
          </Text>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-h-5 text-sm text-muted-fg">
            {requestMessage ??
              "Bấm nút để gửi một bản kiểm tra broadcast về chính bạn."}
          </div>

          <Button isDisabled={isSubmitting} onPress={triggerRealtimePing}>
            {isSubmitting ? "Đang gửi..." : "Kiểm tra realtime"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
