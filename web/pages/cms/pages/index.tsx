import {
  ArrowPathIcon,
  CodeBracketIcon,
  EyeIcon,
  RocketLaunchIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { Head } from "@inertiajs/react";
import { type ReactNode, startTransition, useDeferredValue, useState } from "react";
import { PuckPageBuilder } from "@/components/page-builder/puck-page-builder";
import { PuckPageRender } from "@/components/page-builder/puck-page-render";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Note } from "@/components/ui/note";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@/components/ui/tabs";
import { Code, Strong, Text } from "@/components/ui/text";
import CmsLayout from "@/layouts/cms-layout";
import {
  createDefaultPuckPageData,
  serializePuckPageData,
} from "@/lib/puck/page-builder-data";

const defaultPageJson = serializePuckPageData(createDefaultPuckPageData());

export default function CmsContentPagesPage() {
  const [builderRevision, setBuilderRevision] = useState(0);
  const [draftJson, setDraftJson] = useState(defaultPageJson);
  const [publishedJson, setPublishedJson] = useState(defaultPageJson);
  const deferredPublishedJson = useDeferredValue(publishedJson);
  const isPreviewSynced = draftJson === publishedJson;
  const draftSize = new TextEncoder().encode(draftJson).length;

  function handleReset(): void {
    const nextJson = serializePuckPageData(createDefaultPuckPageData());

    startTransition(() => {
      setBuilderRevision((currentValue) => currentValue + 1);
      setDraftJson(nextJson);
      setPublishedJson(nextJson);
    });
  }

  function handlePreviewPublish(): void {
    startTransition(() => {
      setPublishedJson(draftJson);
    });
  }

  return (
    <>
      <Head title="Trang" />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Card className="rounded-xl border-border bg-overlay shadow-none">
          <CardHeader className="gap-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-3">
                <Badge intent="outline" isCircle={false}>
                  Frontend foundation
                </Badge>
                <div className="space-y-2">
                  <CardTitle className="text-2xl/8 sm:text-3xl/9">
                    Puck page builder wrapper cho pages.content
                  </CardTitle>
                  <CardDescription className="max-w-3xl">
                    Màn này dựng wrapper/editor/read-only render cho dữ liệu
                    `puck_json`, giới hạn palette thành các component đã định
                    nghĩa trong config và tách rõ khỏi luồng BlockNote của bài
                    viết, tài liệu, hồ sơ cán bộ.
                  </CardDescription>
                </div>
              </div>

              <CardAction className="flex flex-wrap gap-2">
                <Button intent="secondary" onPress={handlePreviewPublish}>
                  <RocketLaunchIcon />
                  Đồng bộ preview published
                </Button>
                <Button intent="outline" onPress={handleReset}>
                  <ArrowPathIcon />
                  Khôi phục bản mẫu
                </Button>
              </CardAction>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <Note intent="info">
              <Text className="text-current">
                Wrapper này chỉ phục vụ cho trường <Code>pages.content</Code>.
                Các module <Code>posts</Code>, <Code>documents</Code> và{" "}
                <Code>staff profiles</Code> vẫn giữ convention BlockNote JSON
                riêng của chúng.
              </Text>
            </Note>

            <div className="grid gap-4 xl:grid-cols-3">
              <SummaryCard
                description="Parser và renderer cùng dùng một shape `puck_json` để chuẩn bị cho task Pages module ở phase 5."
                icon={<CodeBracketIcon className="size-5" />}
                title="JSON chuẩn cho pages.content"
              />
              <SummaryCard
                description="Palette hiện chỉ expose `HeroBanner`, `RichTextSection` và `HighlightsGrid` thông qua config allow-list."
                icon={<Squares2X2Icon className="size-5" />}
                title="Palette bị kiểm soát"
              />
              <SummaryCard
                description="Preview published đọc từ snapshot riêng, không phụ thuộc trực tiếp vào state draft đang sửa trong editor."
                icon={<EyeIcon className="size-5" />}
                title="Render published cơ bản"
              />
            </div>
          </CardContent>
        </Card>

        <Tabs
          aria-label="Puck page builder workspace"
          className="gap-4"
          defaultSelectedKey="builder"
        >
          <TabList aria-label="Chế độ làm việc page builder">
            <Tab id="builder">Trình dựng trang</Tab>
            <Tab id="preview">Preview published</Tab>
          </TabList>

          <TabPanels>
            <TabPanel id="builder">
              <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_24rem]">
                <PuckPageBuilder
                  editorKey={builderRevision}
                  content={draftJson}
                  onChange={(nextValue) => {
                    startTransition(() => {
                      setDraftJson(nextValue.json);
                    });
                  }}
                  onPublish={(nextValue) => {
                    startTransition(() => {
                      setDraftJson(nextValue.json);
                      setPublishedJson(nextValue.json);
                    });
                  }}
                />

                <div className="space-y-4">
                  <Card className="rounded-3xl border-border bg-overlay py-0 shadow-xs">
                  <CardHeader>
                      <CardTitle>Trạng thái wrapper</CardTitle>
                      <CardDescription>
                        Snapshot này mô phỏng payload sẽ được lưu vào cột
                        `pages.content`.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 pb-6">
                      <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-1">
                    <StatusBlock
                      label="Định dạng"
                      value="puck_json"
                        />
                        <StatusBlock
                          label="Kích thước payload"
                          value={`${draftSize} bytes`}
                        />
                        <StatusBlock
                          label="Preview published"
                          value={isPreviewSynced ? "Đồng bộ" : "Chưa đồng bộ"}
                        />
                        <StatusBlock
                          label="Scope"
                          value="pages.content"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-3xl border-border bg-overlay py-0 shadow-xs">
                    <CardHeader>
                      <CardTitle>JSON hiện tại</CardTitle>
                      <CardDescription>
                        Dùng để kiểm tra input/output của wrapper trước khi nối
                        sang form thật ở task module Pages.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-6">
                      <ScrollArea className="max-h-[34rem] rounded-2xl border border-border bg-bg p-4">
                        <pre className="text-wrap break-words font-mono text-sm text-fg">
                          {draftJson}
                        </pre>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabPanel>

            <TabPanel id="preview">
              <div className="grid gap-4 xl:grid-cols-[20rem_minmax(0,1fr)]">
                <Card className="rounded-3xl border-border bg-overlay py-0 shadow-xs">
                  <CardHeader>
                    <CardTitle>Published snapshot</CardTitle>
                    <CardDescription>
                      Preview này đọc từ bản JSON đã được xuất bản mô phỏng,
                      giúp kiểm tra component render công khai mà không cần chờ
                      module public website.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 pb-6">
                    <StatusBlock
                      label="Trạng thái"
                      value={isPreviewSynced ? "Theo bản nháp mới nhất" : "Đang dùng snapshot cũ"}
                    />
                    <StatusBlock
                      label="Nguồn dữ liệu"
                      value="publishedJson"
                    />
                    <Text>
                      Khi bấm <Strong>Đồng bộ preview published</Strong> hoặc
                      publish ngay trong Puck header, snapshot này sẽ được cập
                      nhật.
                    </Text>
                  </CardContent>
                </Card>

                <PuckPageRender content={deferredPublishedJson} />
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </>
  );
}

CmsContentPagesPage.layout = (page: ReactNode) => (
  <CmsLayout>{page}</CmsLayout>
);

function StatusBlock({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-bg p-4">
      <Text className="text-sm text-muted-fg">{label}</Text>
      <Heading level={4} className="mt-2 break-words">
        {value}
      </Heading>
    </div>
  );
}

function SummaryCard({
  description,
  icon,
  title,
}: {
  description: string;
  icon: ReactNode;
  title: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-muted/40 p-4">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-full bg-primary-subtle text-primary-subtle-fg">
          {icon}
        </div>
        <Heading level={4}>{title}</Heading>
      </div>
      <Text className="mt-3">{description}</Text>
    </div>
  );
}
