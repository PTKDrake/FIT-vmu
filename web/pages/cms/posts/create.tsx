import { Head, usePage } from "@inertiajs/react";
import type { ReactNode } from "react";
import { PostForm } from "@/components/cms/post-form";
import type { PostFormValues } from "@/components/cms/post-form";
import CmsLayout from "@/layouts/cms-layout";
import { hasPermission } from "@/lib/authorization";
import postsRoutes from "@/routes/cms/posts";
import type { SharedData } from "@/types/shared";

interface PostCreatePageProps {
  categories: Array<{
    value: string;
    label: string;
  }>;
}

const defaultValues: PostFormValues = {
  category_ids: [],
  content: "",
  content_format: "blocknote_json",
  excerpt: "",
  slug: "",
  status: "draft",
  thumbnail_id: null,
  title: "",
};

export default function PostCreatePage({ categories }: PostCreatePageProps) {
  const { auth } = usePage<SharedData>().props;
  const canPublish = hasPermission(auth.permissions, "publish posts");

  function handleSubmit(data: PostFormValues, form: any): void {
    form.post(postsRoutes.store.url());
  }

  return (
    <>
      <Head title="Tạo bài viết mới" />
      <div className="p-4">
        <PostForm
          initialValues={defaultValues}
          categories={categories}
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
