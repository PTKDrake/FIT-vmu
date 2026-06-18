import { HeroSplit } from "@/components/ui/hero-split";
import { getPuckImageUrl } from "@/lib/puck/media";
import { LucideIconRenderer } from "./shared";
import { getPuckBlockDomId } from "./shared";
import type { PageBuilderComponentConfig } from "./types";

export const HeroSplitComponentConfig: PageBuilderComponentConfig<"HeroSplit"> =
  {
    label: "Hero chia cột",
    defaultProps: {
      title: "Chào mừng đến với FIT-VMU",
      description:
        "Khám phá chương trình đào tạo chuẩn quốc tế, trang thiết bị tiên tiến cùng cơ hội học bổng rộng mở.",
      imageUrl: "",
      primaryActionLabel: "Xét tuyển trực tuyến",
      primaryActionHref: "#",
      secondaryActionLabel: "Tìm hiểu thêm",
      secondaryActionHref: "#",
      stats: [
        { title: "30+", subtitle: "Năm truyền thống" },
        { title: "100%", subtitle: "Cơ hội việc làm" },
        { title: "50+", subtitle: "Giảng viên giỏi" },
      ],
      className: "",
    },
    fields: {
      title: { type: "text", label: "Tiêu đề" },
      description: { type: "textarea", label: "Mô tả" },
      imageUrl: { type: "text", label: "Ảnh" },
      primaryActionLabel: { type: "text", label: "Nút chính" },
      primaryActionHref: { type: "text", label: "Link chính" },
      secondaryActionLabel: { type: "text", label: "Nút phụ" },
      secondaryActionHref: { type: "text", label: "Link phụ" },
      stats: {
        type: "array",
        label: "Thống kê",
        max: 4,
        getItemSummary: (item) =>
          item.title ? `${item.title}: ${item.subtitle}` : "Thống kê",
        arrayFields: {
          title: { type: "text", label: "Số liệu" },
          subtitle: { type: "text", label: "Nhãn" },
        },
      },
      className: { type: "text", label: "Lớp CSS bổ sung" },
    },
    render: (props) => {
      const {
        title,
        description,
        imageUrl,
        primaryActionLabel,
        primaryActionHref,
        secondaryActionLabel,
        secondaryActionHref,
        stats,
        className,
      } = props;
      const id = getPuckBlockDomId((props as { id?: string }).id);
      const resolvedImageUrl = getPuckImageUrl(imageUrl);

      return (
        <HeroSplit
          id={id}
          className={className}
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
          imageUrl={resolvedImageUrl}
          fallbackIcon={<LucideIconRenderer name="School" className="size-8" />}
          stats={stats?.map((stat) => ({
            value: stat.title,
            label: stat.subtitle,
          }))}
        />
      );
    },
  };
