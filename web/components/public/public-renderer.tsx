import type { ReactNode } from "react";
import PublicShell, { type NavigationItem } from "./public-shell";
import {
  pageTemplates,
  postTemplates,
  categoryTemplates,
  type PageDataProps,
  type PostDataProps,
  type CategoryDataProps,
} from "./template-registry";

interface PublicRendererProps {
  type: "page" | "post" | "category";
  data: any; // PageDataProps | PostDataProps | CategoryDataProps
  headerMenu?: NavigationItem[];
  footerMenu?: NavigationItem[];
  announcement?: string;
}

export default function PublicRenderer({
  type,
  data,
  headerMenu,
  footerMenu,
  announcement,
}: PublicRendererProps) {
  let content: ReactNode = null;

  if (type === "page") {
    const page = data as PageDataProps;
    const templateKey = page.templateKey || "default";
    const RenderTemplate = pageTemplates[templateKey] || pageTemplates.default;
    content = <RenderTemplate page={page} />;
  } else if (type === "post") {
    const post = data as PostDataProps;
    const templateKey = post.templateKey || "article";
    const RenderTemplate = postTemplates[templateKey] || postTemplates.article;
    content = <RenderTemplate post={post} />;
  } else if (type === "category") {
    const category = data as CategoryDataProps;
    
    // Map display_mode to default archive template keys if key is not set directly
    let templateKey = category.archiveTemplateKey;
    if (!templateKey) {
      if (category.displayMode === "landing") {
        templateKey = "archive-landing";
      } else if (category.displayMode === "hybrid") {
        templateKey = "archive-featured";
      } else {
        templateKey = "archive-default";
      }
    }
    
    const RenderTemplate = categoryTemplates[templateKey] || categoryTemplates["archive-default"];
    content = <RenderTemplate category={category} />;
  }

  // Blank template option doesn't render shell header/footer
  const isBlankPage = type === "page" && data.templateKey === "blank";

  if (isBlankPage) {
    return <div className="bg-bg text-fg min-h-screen">{content}</div>;
  }

  return (
    <PublicShell
      headerMenu={headerMenu}
      footerMenu={footerMenu}
      announcement={announcement}
    >
      {content}
    </PublicShell>
  );
}
export { type PageDataProps, type PostDataProps, type CategoryDataProps };
