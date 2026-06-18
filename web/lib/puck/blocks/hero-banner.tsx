import { HeroBanner } from "@/components/ui/hero-banner";
import { getPuckBlockDomId } from "./shared";
import type { PageBuilderComponentConfig } from "./types";

export const HeroBannerComponentConfig: PageBuilderComponentConfig<"HeroBanner"> =
  {
    label: "Khối đầu trang",
    defaultProps: {
      eyebrow: "Trang VMUFit",
      title: "Tiêu đề trang",
      description: "Mô tả ngắn cho phần mở đầu của trang.",
      primaryActionHref: "/",
      primaryActionLabel: "Hành động chính",
      secondaryActionHref: "/dashboard",
      secondaryActionLabel: "Hành động phụ",
      className: "",
    },
    fields: {
      eyebrow: { type: "text", label: "Nhãn" },
      title: { type: "text", label: "Tiêu đề" },
      description: { type: "textarea", label: "Mô tả" },
      primaryActionLabel: { type: "text", label: "Nút chính" },
      primaryActionHref: { type: "text", label: "Link chính" },
      secondaryActionLabel: { type: "text", label: "Nút phụ" },
      secondaryActionHref: { type: "text", label: "Link phụ" },
      className: { type: "text", label: "Lớp CSS bổ sung" },
    },
    render: (props) => {
      const {
        eyebrow,
        title,
        description,
        primaryActionHref,
        primaryActionLabel,
        secondaryActionHref,
        secondaryActionLabel,
        className,
      } = props;
      const id = getPuckBlockDomId((props as { id?: string }).id);

      return (
        <HeroBanner
          id={id}
          className={className}
          eyebrow={eyebrow}
          title={title}
          description={description}
          primaryAction={{
            label: primaryActionLabel,
            href: primaryActionHref,
          }}
          secondaryAction={{
            label: secondaryActionLabel,
            href: secondaryActionHref,
          }}
        />
      );
    },
  };
