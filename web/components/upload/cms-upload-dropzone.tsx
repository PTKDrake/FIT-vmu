"use client";

import {
  ArrowUpTrayIcon,
  DocumentTextIcon,
  PhotoIcon,
  TableCellsIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";
import {   useDropzone } from "react-dropzone";
import type {Accept, FileRejection} from "react-dropzone";
import { twMerge } from "tailwind-merge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DropZone } from "@/components/ui/drop-zone";
import {
  ProgressBar,
  ProgressBarHeader,
  ProgressBarTrack,
  ProgressBarValue,
} from "@/components/ui/progress-bar";
import { Code, Strong, Text } from "@/components/ui/text";

interface CmsUploadDropzoneProps {
  accept: Accept;
  description: string;
  disabled?: boolean;
  files: File[];
  helperText: string;
  maxFiles: number;
  maxSize: number;
  onFilesChange: (files: File[]) => void;
  progress?: number | null;
  title: string;
}

export function CmsUploadDropzone({
  accept,
  description,
  disabled = false,
  files,
  helperText,
  maxFiles,
  maxSize,
  onFilesChange,
  progress = null,
  title,
}: CmsUploadDropzoneProps) {
  const [rejections, setRejections] = useState<FileRejection[]>([]);

  const acceptSummary = useMemo(
    () =>
      Object.values(accept)
        .flat()
        .map((extension) => extension.replace(".", "").toUpperCase())
        .join(", "),
    [accept],
  );

  const {
    getInputProps,
    getRootProps,
    isDragAccept,
    isDragActive,
    isDragReject,
    open,
  } = useDropzone({
    accept,
    disabled,
    maxFiles,
    maxSize,
    multiple: maxFiles > 1,
    noKeyboard: true,
    noClick: true,
    onDrop: (acceptedFiles, fileRejections) => {
      setRejections(fileRejections);
      onFilesChange(maxFiles > 1 ? acceptedFiles : acceptedFiles.slice(0, 1));
    },
  });

  return (
    <Card className="overflow-hidden rounded-xl border-border bg-overlay shadow-none">
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <Badge intent="outline" isCircle={false}>
              {title}
            </Badge>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>

          <div className="rounded-xl bg-muted p-3 text-fg">
            <UploadPresetIcon title={title} className="size-5" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid gap-4">
        <div {...getRootProps()}>
          <DropZone
            className={twMerge(
              "rounded-xl border border-dashed p-5 transition-colors",
              "bg-muted/30 hover:bg-muted/45",
              "focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring/40",
              isDragActive ? "border-info-subtle-fg bg-info-subtle/40" : "",
              isDragAccept
                ? "border-success-subtle-fg bg-success-subtle/35"
                : "",
              isDragReject ? "border-danger-subtle-fg bg-danger-subtle/30" : "",
              disabled ? "cursor-not-allowed opacity-60" : "",
            )}
          >
            <input {...getInputProps()} />

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ArrowUpTrayIcon className="size-5 text-muted-fg" />
                  <Strong className="text-fg">
                    {isDragActive
                      ? "Thả tệp vào đây"
                      : "Kéo thả hoặc dùng nút để chọn tệp"}
                  </Strong>
                </div>
                <Text>{helperText}</Text>
                <Text className="text-xs uppercase tracking-[0.18em] text-muted-fg">
                  Định dạng hỗ trợ: {acceptSummary}
                </Text>
              </div>

              <Button intent="outline" isDisabled={disabled} onPress={open}>
                Chọn tệp
              </Button>
            </div>
          </DropZone>
        </div>

        {progress !== null ? (
          <ProgressBar value={progress}>
            <ProgressBarHeader>
              <Text className="text-sm text-fg">Tiến độ tải lên</Text>
              <ProgressBarValue className="text-sm text-fg" />
            </ProgressBarHeader>
            <ProgressBarTrack />
          </ProgressBar>
        ) : null}

        <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="rounded-xl border border-border bg-muted/25 p-4">
            <div className="flex items-center justify-between gap-2">
              <Strong className="text-fg">Tệp hợp lệ</Strong>
              <Badge intent="success" isCircle={false}>
                {files.length}
              </Badge>
            </div>

            <div className="mt-3 space-y-2">
              {files.length > 0 ? (
                files.map((file, index) => (
                  <div
                    key={`${file.name}-${file.size}-${index}`}
                    className="flex items-start justify-between gap-3 rounded-lg border border-border bg-overlay px-3 py-2"
                  >
                    <div className="min-w-0 space-y-1">
                      <p className="truncate font-medium text-fg">
                        {file.name}
                      </p>
                      <Text>{formatBytes(file.size)}</Text>
                    </div>

                    <Button
                      intent="plain"
                      size="sq-xs"
                      aria-label={`Xóa ${file.name}`}
                      onPress={() => {
                        onFilesChange(
                          files.filter((_, current) => current !== index),
                        );
                      }}
                    >
                      <XMarkIcon />
                    </Button>
                  </div>
                ))
              ) : (
                <Text>Chưa có tệp nào được chọn.</Text>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-muted/25 p-4">
            <div className="flex items-center justify-between gap-2">
              <Strong className="text-fg">Từ chối ở frontend</Strong>
              <Badge intent="warning" isCircle={false}>
                {rejections.length}
              </Badge>
            </div>

            <div className="mt-3 space-y-3">
              {rejections.length > 0 ? (
                rejections.map(({ errors, file }) => (
                  <div
                    key={`${file.name}-${file.size}-${file.lastModified}`}
                    className="rounded-lg border border-danger-subtle/50 bg-danger-subtle/20 px-3 py-2"
                  >
                    <p className="font-medium text-fg">{file.name}</p>
                    <div className="mt-2 space-y-1">
                      {errors.map((error) => (
                        <Text
                          key={error.code}
                          className="text-danger-subtle-fg"
                        >
                          {mapDropzoneError(error.message, maxFiles, maxSize)}
                        </Text>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <Text>
                  Frontend chỉ chặn nhanh để hỗ trợ UX. Backend vẫn phải
                  validate
                  <Code className="mx-1">mime type</Code>, kích thước và quyền
                  upload.
                </Text>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function mapDropzoneError(
  message: string,
  maxFiles: number,
  maxSize: number,
): string {
  if (message.includes("too many files")) {
    return `Chỉ được chọn tối đa ${maxFiles} tệp trong ô tải lên này.`;
  }

  if (message.includes("larger than")) {
    return `Tệp vượt quá giới hạn ${formatBytes(maxSize)}.`;
  }

  if (message.includes("type")) {
    return "Định dạng tệp không nằm trong danh sách cho phép.";
  }

  return message;
}

function UploadPresetIcon({
  className,
  title,
}: {
  className?: string;
  title: string;
}) {
  if (title === "Excel") {
    return <TableCellsIcon className={className} />;
  }

  if (title === "Tài liệu") {
    return <DocumentTextIcon className={className} />;
  }

  return <PhotoIcon className={className} />;
}
