import { Text } from "@/components/ui/text";

export function CmsPagePlaceholder({
  title,
  description,
}: {
  description: string;
  title: string;
}) {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="min-h-[100vh] flex-1 rounded-2xl border border-border bg-overlay md:min-h-min">
        <div className="border-b border-border px-5 py-4">
          <p className="text-lg font-semibold text-fg">{title}</p>
          <p className="text-sm text-muted-fg">{description}</p>
        </div>

        <div className="px-5 py-6">
          <div className="rounded-xl border border-border bg-muted/35 px-4 py-5">
            <Text className="text-sm text-muted-fg">
              Nội dung cho mục này sẽ được cập nhật theo cùng giao diện quản
              trị.
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}
