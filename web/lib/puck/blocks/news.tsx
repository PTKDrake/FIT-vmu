import { NewsCustom } from "@/components/cms/news";
import { getPuckBlockDomId } from "./shared";
import type { PageBuilderComponentConfig } from "./types";

export const NewsCustomComponentConfig: PageBuilderComponentConfig<"NewsCustom"> =
  {
    label: "Tin tức nổi bật",
    defaultProps: {
      title: "Tin tức nổi bật",
      viewAllLabel: "Xem tất cả",
      viewAllHref: "#",
      featured: {
        image: null,
        date: "15/05/2025",
        title: "Lễ trao bằng tốt nghiệp đợt 1 năm 2025",
        description:
          "Khoa CNTT chúc mừng các tân kỹ sư, cử nhân CNTT. Chúc các bạn luôn vững bước trên con đường đã chọn và gặt hái nhiều thành công trong tương lai.",
        href: "#",
      },
      items: [
        {
          image: null,
          date: "10/05/2025",
          title:
            "Sinh viên Khoa CNTT đạt giải tại cuộc thi Olympic Tin học toàn quốc năm 2025",
          href: "#",
        },
        {
          image: null,
          date: "05/05/2025",
          title:
            "Hội thảo khoa học về ứng dụng AI & Chuyển đổi số trong giáo dục đại học",
          href: "#",
        },
        {
          image: null,
          date: "28/04/2025",
          title:
            "Đội tuyển sinh viên đại diện trường tham dự vòng loại ICPC 2025",
          href: "#",
        },
      ],
    },
    fields: {
      title: { type: "text", label: "Tiêu đề lớn" },
      viewAllLabel: { type: "text", label: "Nhãn liên kết xem tất cả" },
      viewAllHref: { type: "text", label: "Đường dẫn xem tất cả" },
      featured: {
        type: "object",
        label: "Bài viết nổi bật chính",
        objectFields: {
          image: { type: "cmsMedia" as any, label: "Hình ảnh bài viết" },
          date: { type: "text", label: "Ngày đăng bài" },
          title: { type: "text", label: "Tiêu đề bài viết" },
          description: { type: "textarea", label: "Mô tả ngắn tóm tắt" },
          href: { type: "text", label: "Đường dẫn chi tiết" },
        },
      },
      items: {
        type: "array",
        label: "Danh sách bài viết khác",
        getItemSummary: (item) =>
          `${item.date || "Bài viết"}: ${item.title || ""}`,
        arrayFields: {
          image: { type: "cmsMedia" as any, label: "Hình ảnh thu nhỏ" },
          date: { type: "text", label: "Ngày đăng bài" },
          title: { type: "text", label: "Tiêu đề bài viết" },
          href: { type: "text", label: "Đường dẫn chi tiết" },
        },
      },
    },
    render: (props) => {
      const { title, viewAllLabel, viewAllHref, featured, items } = props;
      const id = getPuckBlockDomId((props as { id?: string }).id);

      return (
        <div id={id} className="w-full">
          <NewsCustom
            title={title}
            viewAllLabel={viewAllLabel}
            viewAllHref={viewAllHref}
            featured={featured}
            items={items}
          />
        </div>
      );
    },
  };
