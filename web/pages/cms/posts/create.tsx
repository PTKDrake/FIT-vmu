import { Head, usePage } from "@inertiajs/react";
import type { ReactNode } from "react";
import { PostForm } from "@/components/cms/post-form";
import type { PostFormValues } from "@/components/cms/post-form";
import type { CmsLayoutOption } from "@/components/cms/types";
import CmsLayout from "@/layouts/cms-layout";
import { hasPermission } from "@/lib/authorization";
import postsRoutes from "@/routes/cms/posts";
import type { SharedData } from "@/types/shared";

interface PostCreatePageProps {
  categories: Array<{
    value: string;
    label: string;
  }>;
  layoutOptions: CmsLayoutOption[];
  defaultPostLayoutId: number | null;
  studentGroupOptions: Array<{
    value: string;
    label: string;
    code: string;
    scope: "global" | "private";
  }>;
}

const defaultValues: PostFormValues = {
  category_ids: [],
  content: "",
  content_format: "blocknote_json",
  excerpt: "",
  slug: "",
  status: "draft",
  student_group_ids: [],
  thumbnail_id: null,
  title: "",
  visibility: "public",
  site_layout_id: null,
};

export default function PostCreatePage({
  categories,
  layoutOptions,
  defaultPostLayoutId,
  studentGroupOptions,
}: PostCreatePageProps) {
  const { auth } = usePage<SharedData>().props;
  const canPublish = hasPermission(auth.permissions, "publish posts");
  const canCreateGlobalGroup = hasPermission(
    auth.permissions,
    "manage shared student groups",
  );

  function handleSubmit(
    data: PostFormValues,
    form: any,
    options?: {
      onError?: () => void;
      onFinish?: () => void;
      onSuccess?: () => void;
    },
  ): void {
    form.post(postsRoutes.store.url(), options);
  }

  return (
    <>
      <Head title="Tạo bài viết mới" />
      <div className="p-4">
        <PostForm
          initialValues={defaultValues}
          allowGlobalGroupCreation={canCreateGlobalGroup}
          categories={categories}
          layoutOptions={layoutOptions}
          defaultPostLayoutId={defaultPostLayoutId}
          studentGroupOptions={studentGroupOptions}
          onSubmit={handleSubmit}
          submitLabel="Tạo bài viết"
          cancelHref="/cms/posts"
          canPublish={canPublish}
        />
      </div>
    </>
  );
}

PostCreatePage.layout = (page: ReactNode) => <CmsLayout>{page}</CmsLayout>;
