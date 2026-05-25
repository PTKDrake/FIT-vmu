import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
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
      <Card className="min-h-[100vh] flex-1 rounded-xl border-border bg-overlay shadow-none md:min-h-min">
        <CardHeader className="gap-4">
          <div className="space-y-3">
            <Badge intent="outline" isCircle={false}>
              Trang CMS
            </Badge>
            <div className="space-y-2">
              <Heading level={2} className="text-2xl/8 sm:text-3xl/9">
                {title}
              </Heading>
              <Text className="max-w-3xl">{description}</Text>
            </div>
          </div>
        </CardHeader>

        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-muted/40 p-4">
            <CardTitle>Danh sách chính</CardTitle>
            <Text className="mt-2">
              Khu vực này sẽ dùng lại layout CMS hiện tại để hiển thị bảng dữ
              liệu, bộ lọc và các hành động hàng loạt.
            </Text>
          </div>
          <div className="rounded-xl border border-border bg-muted/40 p-4">
            <CardTitle>Bộ lọc và công cụ</CardTitle>
            <Text className="mt-2">
              Thanh công cụ phía trên sẽ được tái sử dụng cho tìm kiếm, bộ lọc
              trạng thái và thao tác tạo mới.
            </Text>
          </div>
          <div className="rounded-xl border border-border bg-muted/40 p-4">
            <CardTitle>Chi tiết mục</CardTitle>
            <Text className="mt-2">
              Các trang con sẽ chia sẻ cùng sidebar, header, footer và khu vực
              nội dung để giữ trải nghiệm CMS đồng nhất.
            </Text>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
