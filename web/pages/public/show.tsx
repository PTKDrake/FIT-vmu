import PublicRenderer from "@/components/public/public-renderer";
import type { NavigationItem } from "@/components/public/public-shell";
import type {
  CategoryDataProps,
  PageDataProps,
  PostDataProps,
} from "@/components/public/template-registry";

interface PublicShowPageProps {
  type: "page" | "post" | "category";
  data: PageDataProps | PostDataProps | CategoryDataProps;
  headerMenu?: NavigationItem[];
  footerMenu?: NavigationItem[];
  announcement?: string | null;
}

export default function PublicShowPage({
  type,
  data,
  headerMenu,
  footerMenu,
  announcement,
}: PublicShowPageProps) {
  return (
    <PublicRenderer
      type={type}
      data={data}
      headerMenu={headerMenu}
      footerMenu={footerMenu}
      announcement={announcement ?? undefined}
    />
  );
}
