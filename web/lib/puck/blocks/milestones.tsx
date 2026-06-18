import { Milestones } from "@/components/cms/milestones";
import { getPuckBlockDomId } from "./shared";
import type { PageBuilderComponentConfig } from "./types";

export const MilestonesComponentConfig: PageBuilderComponentConfig<"Milestones"> =
  {
    label: "Cột mốc phát triển",
    defaultProps: {
      title: "Các cột mốc phát triển",
      milestones: [
        {
          icon: "Flag",
          years: "1997 - 1999",
          title: "Thành lập và khởi đầu",
          description: "Khoa được thành lập, xây dựng nền tảng đào tạo CNTT.",
        },
        {
          icon: "GraduationCap",
          years: "2000 - 2006",
          title: "Mở rộng đào tạo",
          description:
            "Phát triển chương trình, tăng quy mô và đội ngũ giảng viên.",
        },
        {
          icon: "BarChart2",
          years: "2007 - 2014",
          title: "Nâng cao chất lượng",
          description:
            "Chuẩn hóa chương trình, đẩy mạnh nghiên cứu và hợp tác.",
        },
        {
          icon: "Globe",
          years: "2015 - 2020",
          title: "Hội nhập & đổi mới",
          description: "Áp dụng công nghệ mới, tăng cường hợp tác quốc tế.",
        },
        {
          icon: "Rocket",
          years: "2021 - nay",
          title: "Phát triển bền vững",
          description:
            "Hướng tới chuyển đổi số, đào tạo nguồn nhân lực chất lượng cao.",
        },
      ],
    },
    fields: {
      title: { type: "text", label: "Tiêu đề chính" },
      milestones: {
        type: "array",
        label: "Danh sách cột mốc",
        getItemSummary: (item) =>
          `${item.years || "Cột mốc"}: ${item.title || ""}`,
        arrayFields: {
          icon: {
            type: "select",
            label: "Biểu tượng",
            options: [
              { label: "Cờ (Flag)", value: "Flag" },
              {
                label: "Mũ tốt nghiệp (GraduationCap)",
                value: "GraduationCap",
              },
              { label: "Biểu đồ cột (BarChart2)", value: "BarChart2" },
              { label: "Tăng trưởng (TrendingUp)", value: "TrendingUp" },
              { label: "Địa cầu (Globe)", value: "Globe" },
              { label: "Tên lửa (Rocket)", value: "Rocket" },
              { label: "Giải thưởng (Award)", value: "Award" },
              { label: "Sách mở (BookOpen)", value: "BookOpen" },
              { label: "Cặp sách (Briefcase)", value: "Briefcase" },
            ],
          },
          years: { type: "text", label: "Khoảng thời gian" },
          title: { type: "text", label: "Tiêu đề" },
          description: { type: "textarea", label: "Mô tả chi tiết" },
        },
      },
    },
    render: (props) => {
      const { title, milestones } = props;
      const id = getPuckBlockDomId((props as { id?: string }).id);

      return (
        <div id={id} className="w-full">
          <Milestones title={title} milestones={milestones} />
        </div>
      );
    },
  };
