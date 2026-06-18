import { StatsCustom } from "@/components/cms/stats-custom";
import { getPuckBlockDomId } from "./shared";
import type { PageBuilderComponentConfig } from "./types";

export const StatsCustomComponentConfig: PageBuilderComponentConfig<"StatsCustom"> =
  {
    label: "Lưới thống kê nổi bật",
    defaultProps: {
      title: "Thống kê nổi bật",
      viewAllLabel: "Xem tất cả",
      viewAllHref: "#",
      stats: [
        {
          icon: "Calendar",
          value: "1997",
          label: "Năm thành lập",
        },
        {
          icon: "GraduationCap",
          value: "5",
          label: "Hướng đào tạo",
        },
        {
          icon: "TrendingUp",
          value: "30+",
          label: "Năm phát triển",
        },
        {
          icon: "Users",
          value: "1500+",
          label: "Sinh viên & học viên",
        },
      ],
      className: "",
    },
    fields: {
      title: {
        type: "text",
        label: "Tiêu đề (chỉ hiện trên Mobile)",
      },
      viewAllLabel: {
        type: "text",
        label: "Nhãn xem thêm (chỉ hiện trên Mobile)",
      },
      viewAllHref: {
        type: "text",
        label: "Liên kết xem thêm (chỉ hiện trên Mobile)",
      },
      stats: {
        type: "array",
        label: "Danh sách số liệu",
        getItemSummary: (item) =>
          `${item.value || "0"}: ${item.label || "Số liệu"}`,
        arrayFields: {
          icon: {
            type: "select",
            label: "Biểu tượng",
            options: [
              { label: "Lịch (Calendar)", value: "Calendar" },
              {
                label: "Mũ tốt nghiệp (GraduationCap)",
                value: "GraduationCap",
              },
              { label: "Thống kê (BarChart)", value: "BarChart" },
              { label: "Người dùng (Users)", value: "Users" },
              { label: "Tên lửa (Rocket)", value: "Rocket" },
              { label: "Bảng giảng dạy (Presentation)", value: "Presentation" },
              { label: "Địa cầu (Globe)", value: "Globe" },
              { label: "Cúp giải thưởng (Award)", value: "Award" },
            ],
          },
          value: { type: "text", label: "Số liệu nổi bật" },
          label: { type: "text", label: "Nhãn chú thích" },
        },
      },
      className: { type: "text", label: "Lớp CSS bổ sung" },
    },
    render: (props) => {
      const { title, viewAllLabel, viewAllHref, stats, className } = props;
      const id = getPuckBlockDomId((props as { id?: string }).id);

      return (
        <div id={id} className="w-full">
          <StatsCustom
            title={title}
            viewAllLabel={viewAllLabel}
            viewAllHref={viewAllHref}
            stats={stats}
            className={className}
          />
        </div>
      );
    },
  };
