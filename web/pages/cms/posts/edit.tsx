import { Head, usePage } from "@inertiajs/react";
import type { ReactNode } from "react";
import { PostForm } from "@/components/cms/post-form";
import type { PostFormValues } from "@/components/cms/post-form";
import CmsLayout from "@/layouts/cms-layout";
import { hasPermission } from "@/lib/authorization";
import postsRoutes from "@/routes/cms/posts";
import type { SharedData } from "@/types/shared";

interface PostEditPageProps {
  post: PostFormValues;
  categories: Array<{
    value: string;
    label: string;
  }>;
}

export default function PostEditPage({ post, categories }: PostEditPageProps) {
  const { auth } = usePage<SharedData>().props;
  const canPublish = hasPermission(auth.permissions, "publish posts");

  function handleSubmit(data: PostFormValues, form: any): void {
    if (!post.id) {
      return;
    }

    form.patch(postsRoutes.update.url({ post: post.id }));
  }

  return (
    <>
      <Head title="Chỉnh sửa bài viết" />
      <div className="p-4">
        <PostForm
          initialValues={post}
          categories={categories}
          onSubmit={handleSubmit}
          submitLabel="Lưu thay đổi"
          cancelHref="/cms/posts"
          canPublish={canPublish}
        />
      </div>
    </>
  );
}

PostEditPage.layout = (page: ReactNode) => <CmsLayout>{page}</CmsLayout>;
