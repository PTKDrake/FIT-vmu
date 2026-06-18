import { HeroCustom } from "@/components/cms/hero-custom";
import { getPuckBlockDomId } from "./shared";
import type { PageBuilderComponentConfig } from "./types";

export const HeroCustomComponentConfig: PageBuilderComponentConfig<"HeroCustom"> =
  {
    label: "Khối Hero nổi bật",
    defaultProps: {
      badge: "Tuyển sinh 2026",
      title: "Đào tạo, nghiên cứu và đổi mới vì ngành hàng hải số",
      description:
        "Khoa Công nghệ thông tin xây dựng chương trình đào tạo tiên tiến, gắn với thực tiễn, phát triển năng lực công nghệ, nghiên cứu ứng dụng và kết nối doanh nghiệp.",
      imageUrl: "",
      primaryActionLabel: "Giới thiệu khoa",
      primaryActionHref: "#",
      secondaryActionLabel: "Tuyển sinh",
      secondaryActionHref: "#",
      theme: "light",
      className: "",
    },
    fields: {
      badge: { type: "text", label: "Nhãn nhỏ" },
      title: { type: "text", label: "Tiêu đề lớn" },
      description: { type: "textarea", label: "Mô tả ngắn" },
      imageUrl: { type: "text", label: "Hình ảnh" },
      primaryActionLabel: { type: "text", label: "Nút hành động chính" },
      primaryActionHref: { type: "text", label: "Liên kết chính" },
      secondaryActionLabel: { type: "text", label: "Nút hành động phụ" },
      secondaryActionHref: { type: "text", label: "Liên kết phụ" },
      theme: {
        type: "select",
        label: "Kiểu nền",
        options: [
          { label: "Nền sáng (Mặc định)", value: "light" },
          { label: "Nền tối", value: "dark" },
        ],
      },
      className: { type: "text", label: "Lớp CSS bổ sung" },
    },
    render: (props) => {
      const {
        badge,
        title,
        description,
        imageUrl,
        primaryActionLabel,
        primaryActionHref,
        secondaryActionLabel,
        secondaryActionHref,
        theme,
        className,
      } = props;
      const id = getPuckBlockDomId((props as { id?: string }).id);

      return (
        <div id={id} className="w-full">
          <HeroCustom
            badge={badge}
            title={title}
            description={description}
            imageUrl={imageUrl}
            primaryActionLabel={primaryActionLabel}
            primaryActionHref={primaryActionHref}
            secondaryActionLabel={secondaryActionLabel}
            secondaryActionHref={secondaryActionHref}
            theme={theme}
            className={className}
          />
        </div>
      );
    },
  };
