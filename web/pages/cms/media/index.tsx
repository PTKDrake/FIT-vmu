import { Head } from "@inertiajs/react";
import type { ReactNode } from "react";
import { useState } from "react";
import { CmsUploadDropzone } from "@/components/upload/cms-upload-dropzone";
import { uploadPresets } from "@/components/upload/upload-presets";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Code, Text } from "@/components/ui/text";
import CmsLayout from "@/layouts/cms-layout";

export default function CmsMediaPage() {
  const [avatarFiles, setAvatarFiles] = useState<File[]>([]);
  const [thumbnailFiles, setThumbnailFiles] = useState<File[]>([]);
  const [documentFiles, setDocumentFiles] = useState<File[]>([]);
  const [excelFiles, setExcelFiles] = useState<File[]>([]);

  return (
    <>
      <Head title="Media" />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Card className="rounded-xl border-border bg-overlay shadow-none">
          <CardHeader className="gap-4">
            <div className="space-y-3">
              <Badge intent="outline" isCircle={false}>
                Upload foundation
              </Badge>
              <div className="space-y-2">
                <Heading level={2} className="text-2xl/8 sm:text-3xl/9">
                  Tải tệp dùng chung cho CMS
                </Heading>
                <Text className="max-w-4xl">
                  Foundation này dùng <Code>react-dropzone</Code> để xử lý kéo
                  thả và chọn tệp, đồng thời bọc lại bằng component cùng token
                  giao diện hiện tại. Validate ở frontend chỉ để hỗ trợ UX;
                  backend vẫn phải kiểm tra mime type, kích thước, quyền upload
                  và luồng lưu trữ thực tế.
                </Text>
              </div>
            </div>
          </CardHeader>

          <CardContent className="grid gap-4 md:grid-cols-2">
            <CmsUploadDropzone
              {...uploadPresets.avatar}
              files={avatarFiles}
              onFilesChange={setAvatarFiles}
            />
            <CmsUploadDropzone
              {...uploadPresets.thumbnail}
              files={thumbnailFiles}
              onFilesChange={setThumbnailFiles}
            />
            <CmsUploadDropzone
              {...uploadPresets.document}
              files={documentFiles}
              onFilesChange={setDocumentFiles}
            />
            <CmsUploadDropzone
              {...uploadPresets.excel}
              files={excelFiles}
              onFilesChange={setExcelFiles}
            />
          </CardContent>
        </Card>

        <Card className="rounded-xl border-border bg-overlay shadow-none">
          <CardHeader>
            <CardTitle>Gợi ý tích hợp tiếp theo</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <Text className="text-fg">
                Avatar và thumbnail có thể gắn vào form <Code>staff_profiles</Code>,{" "}
                <Code>posts</Code>, <Code>pages</Code>.
              </Text>
            </div>
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <Text className="text-fg">
                Tài liệu và Excel có thể nối với <Code>useForm</Code> của
                Inertia để hiển thị progress upload từ backend.
              </Text>
            </div>
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <Text className="text-fg">
                Khi có endpoint thật, chỉ cần thay <Code>onFilesChange</Code>{" "}
                bằng state form và submit multipart qua Inertia.
              </Text>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

CmsMediaPage.layout = (page: ReactNode) => <CmsLayout>{page}</CmsLayout>;
