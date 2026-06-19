import { CtaCustom } from "@/components/cms/cta-custom";
import { getPuckBlockDomId } from "./shared";
import type { PageBuilderComponentConfig } from "./types";

export const CtaCustomComponentConfig: PageBuilderComponentConfig<"CtaCustom"> =
  {
    label: "Khối CTA nâng cao",
    defaultProps: {
      logoUrl: "",
      logoAlt: "Logo FIT",
      siteName: "Khoa CNTT",
      organizationName: "Trường Đại học Hàng hải Việt Nam",
      badge: "Tuyển sinh 2025",
      title:
        "Khám phá chương trình đào tạo – Kiến tạo tương lai số cùng Khoa CNTT",
      highlightWords: "tương lai số, Khoa CNTT",
      description:
        "Tham gia Khoa CNTT – Trường Đại học Hàng hải Việt Nam để học tập trong môi trường hiện đại, sáng tạo và kiến tạo sự nghiệp vững chắc trong thời đại số.",
      imageUrl: "",
      primaryActionLabel: "Tìm hiểu tuyển sinh",
      primaryActionHref: "#",
      secondaryActionLabel: "Liên hệ tư vấn",
      secondaryActionHref: "#",
      trustItems: [
        { icon: "Shield", label: "Đào tạo chất lượng chuẩn quốc tế" },
        { icon: "Users", label: "Đội ngũ giảng viên giàu kinh nghiệm" },
        { icon: "TrendingUp", label: "Cơ hội việc làm rộng mở" },
      ],
      className: "",
    },
    fields: {
      logoUrl: { type: "cmsMedia" as any, label: "Hình ảnh Logo thương hiệu" },
      logoAlt: { type: "text", label: "Mô tả ảnh Logo" },
      siteName: { type: "text", label: "Tên thương hiệu ngắn" },
      organizationName: {
        type: "text",
        label: "Tên tổ chức (dưới thương hiệu)",
      },
      badge: { type: "text", label: "Nhãn nổi bật (chỉ hiện trên Mobile)" },
      title: { type: "text", label: "Tiêu đề chính" },
      highlightWords: {
        type: "text",
        label: "Các từ cần tô màu xanh (cách nhau bằng dấu phẩy)",
      },
      description: { type: "textarea", label: "Mô tả chi tiết" },
      imageUrl: {
        type: "cmsMedia" as any,
        label: "Hình ảnh 3D minh họa (phải)",
      },
      primaryActionLabel: { type: "text", label: "Nhãn nút hành động chính" },
      primaryActionHref: { type: "text", label: "Đường dẫn hành động chính" },
      secondaryActionLabel: { type: "text", label: "Nhãn nút hành động phụ" },
      secondaryActionHref: { type: "text", label: "Đường dẫn hành động phụ" },
      trustItems: {
        type: "array",
        label: "Danh sách 3 điểm nổi bật (chỉ hiện trên Mobile)",
        getItemSummary: (item) => item.label || "Đặc điểm",
        arrayFields: {
          icon: {
            type: "select",
            label: "Biểu tượng",
            options: [
              { label: "Bảo mật (Shield)", value: "Shield" },
              { label: "Giảng viên (Users)", value: "Users" },
              { label: "Thống kê (TrendingUp)", value: "TrendingUp" },
            ],
          },
          label: { type: "text", label: "Mô tả ngắn" },
        },
      },
      className: { type: "text", label: "Lớp CSS bổ sung" },
    },
    render: (props) => {
      const {
        logoUrl,
        logoAlt,
        siteName,
        organizationName,
        badge,
        title,
        highlightWords,
        description,
        imageUrl,
        primaryActionLabel,
        primaryActionHref,
        secondaryActionLabel,
        secondaryActionHref,
        trustItems,
        className,
      } = props;
      const id = getPuckBlockDomId((props as { id?: string }).id);

      return (
        <div id={id} className="w-full">
          <CtaCustom
            logoUrl={logoUrl}
            logoAlt={logoAlt}
            siteName={siteName}
            organizationName={organizationName}
            badge={badge}
            title={title}
            highlightWords={highlightWords}
            description={description}
            imageUrl={imageUrl}
            primaryActionLabel={primaryActionLabel}
            primaryActionHref={primaryActionHref}
            secondaryActionLabel={secondaryActionLabel}
            secondaryActionHref={secondaryActionHref}
            trustItems={trustItems}
            className={className}
          />
        </div>
      );
    },
  };
