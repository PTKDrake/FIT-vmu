import { ProgramsCustom } from "@/components/cms/programs-custom";
import { getPuckBlockDomId } from "./shared";
import type { PageBuilderComponentConfig } from "./types";

export const ProgramsCustomComponentConfig: PageBuilderComponentConfig<"ProgramsCustom"> =
  {
    label: "Lưới chương trình đào tạo",
    defaultProps: {
      badge: "CHƯƠNG TRÌNH ĐÀO TẠO",
      title: "Các hướng đào tạo nổi bật",
      description:
        "Các chương trình đào tạo chất lượng cao, cập nhật xu hướng công nghệ và đáp ứng nhu cầu thực tiễn của thị trường lao động.",
      actionLabel: "Xem tất cả chương trình",
      actionHref: "#",
      programs: [
        {
          icon: "Monitor",
          title: "Công nghệ thông tin",
          description:
            "Trang bị kiến thức nền tảng và nâng cao về lập trình, cấu trúc dữ liệu, trí tuệ nhân tạo và các công nghệ tiên tiến.",
          href: "#",
        },
        {
          icon: "GraduationCap",
          title: "Hệ thống thông tin",
          description:
            "Kết hợp giữa công nghệ và quản trị để phân tích, thiết kế và triển khai các hệ thống thông tin doanh nghiệp.",
          href: "#",
        },
        {
          icon: "Code",
          title: "Kỹ thuật phần mềm",
          description:
            "Đào tạo chuyên sâu về phát triển phần mềm, quy trình phần mềm và kiểm thử để xây dựng sản phẩm chất lượng.",
          href: "#",
        },
        {
          icon: "Shield",
          title: "An toàn thông tin",
          description:
            "Trang bị kiến thức và kỹ năng bảo mật hệ thống, phân tích rủi ro và ứng phó với các mối đe dọa an ninh mạng.",
          href: "#",
        },
      ],
      className: "",
    },
    fields: {
      badge: { type: "text", label: "Nhãn nhỏ (chỉ hiện trên Desktop)" },
      title: { type: "text", label: "Tiêu đề chính" },
      description: {
        type: "textarea",
        label: "Mô tả ngắn (chỉ hiện trên Desktop)",
      },
      actionLabel: { type: "text", label: "Nhãn nút liên kết" },
      actionHref: { type: "text", label: "Đường dẫn liên kết" },
      programs: {
        type: "array",
        label: "Danh sách chương trình",
        getItemSummary: (item) => item.title || "Chương trình",
        arrayFields: {
          icon: {
            type: "select",
            label: "Biểu tượng",
            options: [
              { label: "Màn hình (Monitor)", value: "Monitor" },
              { label: "Cơ sở dữ liệu (Database)", value: "Database" },
              { label: "Mã nguồn (Code)", value: "Code" },
              { label: "Khiên bảo mật (Shield)", value: "Shield" },
              {
                label: "Mũ tốt nghiệp (GraduationCap)",
                value: "GraduationCap",
              },
              { label: "Sách mở (BookOpen)", value: "BookOpen" },
              { label: "Người dùng (Users)", value: "Users" },
              { label: "Giải thưởng (Award)", value: "Award" },
              { label: "Đám mây (Cloud)", value: "Cloud" },
              { label: "Khóa bảo mật (Lock)", value: "Lock" },
              { label: "Trường học (School)", value: "School" },
            ],
          },
          title: { type: "text", label: "Tiêu đề" },
          description: { type: "textarea", label: "Mô tả chi tiết" },
          href: { type: "text", label: "Đường dẫn chi tiết" },
        },
      },
      className: { type: "text", label: "Lớp CSS bổ sung" },
    },
    render: (props) => {
      const {
        badge,
        title,
        description,
        actionLabel,
        actionHref,
        programs,
        className,
      } = props;
      const id = getPuckBlockDomId((props as { id?: string }).id);

      return (
        <div id={id} className="w-full">
          <ProgramsCustom
            badge={badge}
            title={title}
            description={description}
            actionLabel={actionLabel}
            actionHref={actionHref}
            programs={programs}
            className={className}
          />
        </div>
      );
    },
  };
