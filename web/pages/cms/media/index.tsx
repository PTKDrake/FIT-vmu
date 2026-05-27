import { Head } from "@inertiajs/react";
import type { ReactNode } from "react";
import { useState } from "react";
import { CmsUploadDropzone } from "@/components/upload/cms-upload-dropzone";
import { uploadPresets } from "@/components/upload/upload-presets";
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
        <div className="rounded-2xl border border-border bg-overlay">
          <div className="border-b border-border px-5 py-4">
            <p className="text-lg font-semibold text-fg">Thư viện tệp</p>
            <p className="max-w-4xl text-sm text-muted-fg">
              Tải ảnh và tài liệu theo từng nhóm sử dụng trong CMS.
            </p>
          </div>

          <div className="grid gap-4 p-5 md:grid-cols-2">
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
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-overlay">
          <div className="border-b border-border px-5 py-4">
            <p className="text-lg font-semibold text-fg">Gợi ý sử dụng</p>
            <p className="text-sm text-muted-fg">
              Một số kiểu tệp đang sẵn sàng để nối vào form nội dung.
            </p>
          </div>

          <div className="grid gap-3 p-5 md:grid-cols-3">
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <Text className="text-fg">
                Avatar và thumbnail có thể dùng cho <Code>staff_profiles</Code>,{" "}
                <Code>posts</Code> và <Code>pages</Code>.
              </Text>
            </div>
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <Text className="text-fg">
                Tài liệu và Excel có thể nối vào form Inertia khi có API tải lên.
              </Text>
            </div>
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <Text className="text-fg">
                Khi có endpoint thật, chỉ cần thay <Code>onFilesChange</Code> bằng
                state form tương ứng.
              </Text>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

CmsMediaPage.layout = (page: ReactNode) => <CmsLayout>{page}</CmsLayout>;
