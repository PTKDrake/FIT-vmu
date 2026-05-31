import { twMerge } from "tailwind-merge";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Link } from "@/components/ui/link";
import { Text } from "@/components/ui/text";
import type { PageBuilderComponentConfig } from "./types";

// --- MOCK DATA ---
const MOCK_POSTS = [
  {
    id: 1,
    title: "Khai mạc tuần sinh viên nghiên cứu khoa học FIT-VMU 2026",
    excerpt:
      "Hoạt động thường niên thúc đẩy đam mê sáng tạo công nghệ và nghiên cứu học thuật trong sinh viên toàn khoa.",
    author: "Ban Truyền thông",
    date: "30/05/2026",
    category: "Nghiên cứu khoa học",
  },
  {
    id: 2,
    title: "Lễ ký kết hợp tác chiến lược giữa Khoa CNTT và FPT Software",
    excerpt:
      "Mở ra hàng trăm cơ hội thực tập thực chiến chất lượng cao và cam kết việc làm 100% cho sinh viên tốt nghiệp.",
    author: "Văn phòng Khoa",
    date: "25/05/2026",
    category: "Hợp tác doanh nghiệp",
  },
  {
    id: 3,
    title: "Đội tuyển FIT-VMU xuất sắc đạt giải Nhì Olympic Tin học Quốc gia",
    excerpt:
      "Vượt qua hơn 80 trường Đại học trên cả nước, đội tuyển sinh viên Khoa CNTT tiếp tục khẳng định vị thế dẫn đầu.",
    author: "CLB Tin học",
    date: "20/05/2026",
    category: "Giải thưởng & Thành tích",
  },
];

const MOCK_ANNOUNCEMENTS = [
  {
    id: 1,
    title: "Thông báo về việc nhận hồ sơ xét tốt nghiệp đợt 2 năm 2026",
    date: "29/05/2026",
    type: "Học vụ",
  },
  {
    id: 2,
    title: "Lịch thi học phần cuối kỳ học kỳ II năm học 2025-2026 (Chính thức)",
    date: "24/05/2026",
    type: "Khảo thí",
  },
  {
    id: 3,
    title:
      "Đăng ký tham gia chương trình trao đổi sinh viên tại Đại học Tokyo, Nhật Bản",
    date: "18/05/2026",
    type: "Hợp tác quốc tế",
  },
];

const MOCK_STAFF = [
  {
    id: 1,
    name: "PGS.TS. Nguyễn Văn A",
    position: "Trưởng Khoa",
    email: "anv@vimaru.edu.vn",
    expertise: "Học máy, AI & Xử lý ngôn ngữ",
  },
  {
    id: 2,
    name: "TS. Trần Thị B",
    position: "Phó Trưởng Khoa",
    email: "bttran@vimaru.edu.vn",
    expertise: "Mạng máy tính & An toàn thông tin",
  },
  {
    id: 3,
    name: "ThS. Phạm Văn C",
    position: "Trưởng Bộ môn Kỹ thuật phần mềm",
    email: "cvpham@vimaru.edu.vn",
    expertise: "Công nghệ Web, DevOps & IoT",
  },
];

const MOCK_UNITS = [
  {
    id: 1,
    name: "Bộ môn Khoa học máy tính",
    head: "TS. Nguyễn Văn D",
    description:
      "Quản lý và giảng dạy toán tin cốt lõi, trí tuệ nhân tạo, xử lý dữ liệu lớn.",
  },
  {
    id: 2,
    name: "Bộ môn Kỹ thuật phần mềm",
    head: "ThS. Phạm Văn C",
    description:
      "Đào tạo quy trình phát triển phần mềm chuẩn, ứng dụng Web/Mobile và kiểm thử.",
  },
  {
    id: 3,
    name: "Bộ môn Hệ thống thông tin & Mạng",
    head: "TS. Trần Thị B",
    description:
      "Đi sâu phân tích hệ thống doanh nghiệp, an toàn thông tin và quản trị mạng.",
  },
];

const MOCK_DOCUMENTS = [
  {
    id: 1,
    name: "Quy chế đào tạo đại học hệ chính quy chuẩn CDIO 2026.pdf",
    size: "2.4 MB",
    date: "15/05/2026",
  },
  {
    id: 2,
    name: "Mẫu đơn đăng ký xét làm Đồ án tốt nghiệp Kỹ sư.docx",
    size: "120 KB",
    date: "10/05/2026",
  },
  {
    id: 3,
    name: "Hướng dẫn viết báo cáo thực tập tốt nghiệp thực tế.pdf",
    size: "1.1 MB",
    date: "05/05/2026",
  },
];

// 1. LATEST POSTS BLOCK
export const LatestPostsComponentConfig: PageBuilderComponentConfig<"LatestPosts"> =
  {
    label: "Tin tức mới nhất",
    defaultProps: {
      title: "Tin Tức & Hoạt Động Mới",
      limit: 3,
      categoryId: "all",
      layout: "grid",
      showCTA: true,
      className: "",
    },
    fields: {
      title: { type: "text", label: "Tiêu đề khối" },
      limit: { type: "number", label: "Số lượng tin tức" },
      categoryId: {
        type: "text",
        label: "ID Danh mục (để trống nếu lấy tất cả)",
      },
      layout: {
        type: "select",
        label: "Kiểu bố cục",
        options: [
          { label: "Dạng lưới", value: "grid" },
          { label: "Dạng danh sách", value: "list" },
        ],
      },
      showCTA: {
        type: "radio",
        label: "Hiển thị nút 'Xem tất cả'",
        options: [
          { label: "Có", value: true },
          { label: "Không", value: false },
        ],
      },
      className: { type: "text", label: "Lớp CSS bổ sung" },
    },
    render: ({ title, limit, layout, showCTA, className }) => {
      const posts = MOCK_POSTS.slice(0, limit);

      if (posts.length === 0) {
        return (
          <div className="rounded-2xl border border-dashed border-border/80 p-8 text-center text-muted-fg text-sm">
            Không có tin tức nào để hiển thị.
          </div>
        );
      }

      return (
        <section
          className={twMerge("space-y-6 py-6 w-full relative", className)}
        >
          <div className="flex items-end justify-between border-b border-border/60 pb-3">
            <Heading
              level={2}
              className="text-2xl font-extrabold tracking-tight text-fg"
            >
              {title}
            </Heading>
            <Badge
              intent="info"
              isCircle={false}
              className="text-[9px] font-bold border-info/20"
            >
              Dữ liệu động
            </Badge>
          </div>

          <div
            className={twMerge(
              "grid gap-6 w-full",
              layout === "grid" ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1",
            )}
          >
            {posts.map((post) => (
              <Card
                key={post.id}
                className="overflow-hidden rounded-3xl border border-border bg-overlay py-0 shadow-xs transition duration-300 hover:shadow-md hover:border-primary/15 group flex flex-col justify-between"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge
                      intent="primary"
                      isCircle={false}
                      className="text-[9px] font-semibold tracking-wider uppercase border-primary/20 bg-primary-subtle/10 text-primary"
                    >
                      {post.category}
                    </Badge>
                    <span className="text-[10px] text-muted-fg font-medium">
                      {post.date}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <Heading
                      level={3}
                      className="text-base font-bold text-fg group-hover:text-primary transition-colors leading-snug"
                    >
                      {post.title}
                    </Heading>
                    <Text className="text-xs/relaxed text-muted-fg leading-relaxed">
                      {post.excerpt}
                    </Text>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {showCTA && (
            <div className="flex justify-center pt-2">
              <Link
                href="/posts"
                className="inline-flex min-h-10 items-center justify-center rounded-full border border-border bg-bg px-5 py-2 text-xs font-semibold text-fg hover:bg-secondary transition"
              >
                Xem tất cả tin tức
              </Link>
            </div>
          )}
        </section>
      );
    },
  };

// 2. LATEST ANNOUNCEMENTS BLOCK
export const LatestAnnouncementsComponentConfig: PageBuilderComponentConfig<"LatestAnnouncements"> =
  {
    label: "Thông báo mới",
    defaultProps: {
      title: "Thông Báo Quan Trọng",
      limit: 3,
      layout: "list",
      showCTA: true,
      className: "",
    },
    fields: {
      title: { type: "text", label: "Tiêu đề khối" },
      limit: { type: "number", label: "Số lượng thông báo" },
      layout: {
        type: "select",
        label: "Kiểu bố cục",
        options: [
          { label: "Dạng danh sách", value: "list" },
          { label: "Dạng lưới", value: "grid" },
        ],
      },
      showCTA: {
        type: "radio",
        label: "Hiển thị nút 'Xem tất cả'",
        options: [
          { label: "Có", value: true },
          { label: "Không", value: false },
        ],
      },
      className: { type: "text", label: "Lớp CSS bổ sung" },
    },
    render: ({ title, limit, layout, showCTA, className }) => {
      const announcements = MOCK_ANNOUNCEMENTS.slice(0, limit);

      return (
        <section
          className={twMerge("space-y-6 py-6 w-full relative", className)}
        >
          <div className="flex items-end justify-between border-b border-border/60 pb-3">
            <Heading
              level={2}
              className="text-2xl font-extrabold tracking-tight text-fg"
            >
              {title}
            </Heading>
            <Badge
              intent="success"
              isCircle={false}
              className="text-[9px] font-bold border-success/20"
            >
              Thông báo mới
            </Badge>
          </div>

          <div
            className={twMerge(
              "grid gap-4 w-full",
              layout === "grid" ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1",
            )}
          >
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="group relative flex items-start gap-4 rounded-2xl border border-border/60 bg-overlay/50 p-4 transition hover:bg-overlay hover:border-primary/20 hover:shadow-xs"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-warning-subtle text-warning-subtle-fg border border-warning/10 font-bold text-xs uppercase">
                  {ann.type.substring(0, 2)}
                </div>
                <div className="space-y-1 flex-1">
                  <Heading
                    level={3}
                    className="text-sm font-bold text-fg group-hover:text-primary transition-colors leading-snug"
                  >
                    {ann.title}
                  </Heading>
                  <div className="flex items-center gap-3 text-[10px] text-muted-fg font-medium">
                    <span>{ann.date}</span>
                    <span>•</span>
                    <span>{ann.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {showCTA && (
            <div className="flex justify-center pt-2">
              <Link
                href="/announcements"
                className="inline-flex min-h-10 items-center justify-center rounded-full border border-border bg-bg px-5 py-2 text-xs font-semibold text-fg hover:bg-secondary transition"
              >
                Xem tất cả thông báo
              </Link>
            </div>
          )}
        </section>
      );
    },
  };

// 3. STAFF GRID BLOCK
export const StaffGridComponentConfig: PageBuilderComponentConfig<"StaffGrid"> =
  {
    label: "Đội ngũ giảng viên",
    defaultProps: {
      title: "Đội Ngũ Cán Bộ Giảng Viên",
      limit: 3,
      departmentId: "all",
      className: "",
    },
    fields: {
      title: { type: "text", label: "Tiêu đề khối" },
      limit: { type: "number", label: "Số lượng giảng viên tối đa" },
      departmentId: {
        type: "text",
        label: "ID Bộ môn (để trống nếu lấy tất cả)",
      },
      className: { type: "text", label: "Lớp CSS bổ sung" },
    },
    render: ({ title, limit, className }) => {
      const staff = MOCK_STAFF.slice(0, limit);

      return (
        <section
          className={twMerge("space-y-6 py-6 w-full relative", className)}
        >
          <div className="flex items-end justify-between border-b border-border/60 pb-3">
            <Heading
              level={2}
              className="text-2xl font-extrabold tracking-tight text-fg"
            >
              {title}
            </Heading>
            <Badge
              intent="primary"
              isCircle={false}
              className="text-[9px] font-bold border-primary/20"
            >
              Giảng viên
            </Badge>
          </div>

          <div className="grid gap-6 md:grid-cols-3 w-full">
            {staff.map((st) => (
              <Card
                key={st.id}
                className="rounded-3xl border-border bg-overlay py-0 shadow-none hover:shadow-md transition-shadow duration-300 group"
              >
                <CardContent className="p-6 space-y-4 flex flex-col items-center text-center">
                  <Avatar
                    src=""
                    alt={st.name}
                    initials={st.name.split(" ").pop()?.substring(0, 2)}
                    size="xl"
                    className="shadow-xs group-hover:scale-105 transition duration-300"
                  />
                  <div className="space-y-1">
                    <Heading
                      level={3}
                      className="text-base font-bold text-fg group-hover:text-primary transition-colors"
                    >
                      {st.name}
                    </Heading>
                    <Text className="text-xs font-bold text-primary uppercase tracking-wider text-[10px]">
                      {st.position}
                    </Text>
                    <Text className="text-xs text-muted-fg leading-relaxed">
                      Chuyên môn: {st.expertise}
                    </Text>
                  </div>
                  <div className="pt-2 w-full border-t border-border/50 flex items-center justify-center gap-1.5 text-xs text-muted-fg">
                    <svg
                      className="size-3.5 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                      />
                    </svg>
                    <span>{st.email}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      );
    },
  };

// 4. UNIT LIST BLOCK
export const UnitListComponentConfig: PageBuilderComponentConfig<"UnitList"> = {
  label: "Danh sách đơn vị",
  defaultProps: {
    title: "Các Bộ Môn Trực Thuộc Khoa",
    limit: 3,
    type: "academic",
    className: "",
  },
  fields: {
    title: { type: "text", label: "Tiêu đề khối" },
    limit: { type: "number", label: "Số bộ môn tối đa" },
    type: { type: "text", label: "Loại đơn vị (để trống nếu lấy tất cả)" },
    className: { type: "text", label: "Lớp CSS bổ sung" },
  },
  render: ({ title, limit, className }) => {
    const units = MOCK_UNITS.slice(0, limit);

    return (
      <section className={twMerge("space-y-6 py-6 w-full relative", className)}>
        <div className="flex items-end justify-between border-b border-border/60 pb-3">
          <Heading
            level={2}
            className="text-2xl font-extrabold tracking-tight text-fg"
          >
            {title}
          </Heading>
          <Badge
            intent="warning"
            isCircle={false}
            className="text-[9px] font-bold border-warning/20"
          >
            Các đơn vị
          </Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-3 w-full">
          {units.map((un) => (
            <Card
              key={un.id}
              className="overflow-hidden rounded-3xl border border-border bg-overlay py-0 shadow-xs transition duration-300 hover:shadow-md hover:border-primary/15 group flex flex-col justify-between"
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="inline-flex size-10 items-center justify-center rounded-xl border border-primary/5 bg-primary-subtle text-primary shrink-0 transition-colors group-hover:bg-primary group-hover:text-primary-fg shadow-xs">
                    <svg
                      className="size-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.33l-7.5-5-7.5 5V21m16.5 0H3.75"
                      />
                    </svg>
                  </div>
                  <div>
                    <Heading
                      level={3}
                      className="text-base font-bold text-fg group-hover:text-primary transition-colors leading-tight"
                    >
                      {un.name}
                    </Heading>
                    <span className="text-[10px] text-muted-fg font-medium">
                      Trưởng BM: {un.head}
                    </span>
                  </div>
                </div>
                <Text className="text-xs/relaxed text-muted-fg leading-relaxed">
                  {un.description}
                </Text>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  },
};

// 5. DOCUMENT LIST BLOCK
export const DocumentListComponentConfig: PageBuilderComponentConfig<"DocumentList"> =
  {
    label: "Danh sách tài liệu",
    defaultProps: {
      title: "Tải Tài Liệu & Biểu Mẫu",
      limit: 3,
      categoryId: "all",
      showIcon: true,
      className: "",
    },
    fields: {
      title: { type: "text", label: "Tiêu đề khối" },
      limit: { type: "number", label: "Số lượng tài liệu" },
      categoryId: { type: "text", label: "ID danh mục (nếu có)" },
      showIcon: {
        type: "radio",
        label: "Hiển thị biểu tượng file",
        options: [
          { label: "Có", value: true },
          { label: "Không", value: false },
        ],
      },
      className: { type: "text", label: "Lớp CSS bổ sung" },
    },
    render: ({ title, limit, showIcon, className }) => {
      const docs = MOCK_DOCUMENTS.slice(0, limit);

      return (
        <section
          className={twMerge("space-y-6 py-6 w-full relative", className)}
        >
          <div className="flex items-end justify-between border-b border-border/60 pb-3">
            <Heading
              level={2}
              className="text-2xl font-extrabold tracking-tight text-fg"
            >
              {title}
            </Heading>
            <Badge
              intent="success"
              isCircle={false}
              className="text-[9px] font-bold border-success/20"
            >
              Tài liệu
            </Badge>
          </div>

          <div className="grid gap-3 w-full">
            {docs.map((doc) => (
              <div
                key={doc.id}
                className="group relative flex items-center justify-between rounded-2xl border border-border/60 bg-overlay/50 p-4 transition hover:bg-overlay hover:border-primary/20 hover:shadow-xs"
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  {showIcon && (
                    <div className="inline-flex size-9 items-center justify-center rounded-xl bg-danger-subtle text-danger-subtle-fg border border-danger/10 shrink-0">
                      <svg
                        className="size-4.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                        />
                      </svg>
                    </div>
                  )}
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <Heading
                      level={3}
                      className="text-xs font-bold text-fg group-hover:text-primary transition-colors truncate leading-snug"
                    >
                      {doc.name}
                    </Heading>
                    <div className="flex items-center gap-2 text-[10px] text-muted-fg font-medium">
                      <span>{doc.size}</span>
                      <span>•</span>
                      <span>Cập nhật: {doc.date}</span>
                    </div>
                  </div>
                </div>
                <Link
                  href="#"
                  className="inline-flex size-8 items-center justify-center rounded-full bg-primary-subtle text-primary border border-primary/10 transition hover:bg-primary hover:text-primary-fg hover:scale-105 active:scale-95 shrink-0 shadow-xs"
                >
                  <svg
                    className="size-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                    />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </section>
      );
    },
  };

// 6. RELATED POSTS BLOCK
export const RelatedPostsComponentConfig: PageBuilderComponentConfig<"RelatedPosts"> =
  {
    label: "Tin tức liên quan",
    defaultProps: {
      title: "Bài Viết Liên Quan",
      limit: 2,
      className: "",
    },
    fields: {
      title: { type: "text", label: "Tiêu đề khối" },
      limit: { type: "number", label: "Số bài viết liên quan" },
      className: { type: "text", label: "Lớp CSS bổ sung" },
    },
    render: ({ title, limit, className }) => {
      const related = MOCK_POSTS.slice(0, limit);

      return (
        <section
          className={twMerge("space-y-6 py-6 w-full relative", className)}
        >
          <div className="flex items-end justify-between border-b border-border/60 pb-3">
            <Heading level={2} className="text-xl font-bold text-fg">
              {title}
            </Heading>
            <Badge
              intent="info"
              isCircle={false}
              className="text-[9px] font-bold border-info/20"
            >
              Tin liên quan
            </Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-2 w-full">
            {related.map((post) => (
              <Card
                key={post.id}
                className="rounded-3xl border-border bg-overlay py-0 shadow-none hover:shadow-md transition-shadow group flex flex-col justify-between"
              >
                <CardContent className="p-5 space-y-3">
                  <span className="text-[10px] text-primary font-bold uppercase tracking-wider block">
                    {post.category}
                  </span>
                  <Heading
                    level={3}
                    className="text-sm font-bold text-fg group-hover:text-primary transition-colors leading-snug"
                  >
                    {post.title}
                  </Heading>
                  <Text className="text-xs text-muted-fg leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </Text>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      );
    },
  };

// 7. RELATED DOCUMENTS BLOCK
export const RelatedDocumentsComponentConfig: PageBuilderComponentConfig<"RelatedDocuments"> =
  {
    label: "Tài liệu liên quan",
    defaultProps: {
      title: "Tài Liệu Chi Tiết Liên Quan",
      limit: 2,
      className: "",
    },
    fields: {
      title: { type: "text", label: "Tiêu đề khối" },
      limit: { type: "number", label: "Số tài liệu liên quan" },
      className: { type: "text", label: "Lớp CSS bổ sung" },
    },
    render: ({ title, limit, className }) => {
      const docs = MOCK_DOCUMENTS.slice(0, limit);

      return (
        <section
          className={twMerge("space-y-6 py-6 w-full relative", className)}
        >
          <div className="flex items-end justify-between border-b border-border/60 pb-3">
            <Heading level={2} className="text-xl font-bold text-fg">
              {title}
            </Heading>
            <Badge
              intent="success"
              isCircle={false}
              className="text-[9px] font-bold border-success/20"
            >
              Tài liệu đính kèm
            </Badge>
          </div>

          <div className="grid gap-3 w-full">
            {docs.map((doc) => (
              <div
                key={doc.id}
                className="group relative flex items-center justify-between rounded-2xl border border-border/60 bg-overlay/50 p-4 transition hover:bg-overlay hover:border-primary/20 hover:shadow-xs"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="inline-flex size-9 items-center justify-center rounded-xl bg-danger-subtle text-danger-subtle-fg border border-danger/10 shrink-0">
                    <svg
                      className="size-4.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <Heading
                      level={3}
                      className="text-xs font-bold text-fg group-hover:text-primary transition-colors truncate leading-snug"
                    >
                      {doc.name}
                    </Heading>
                    <span className="text-[10px] text-muted-fg font-medium block">
                      Kích thước: {doc.size}
                    </span>
                  </div>
                </div>
                <Link
                  href="#"
                  className="inline-flex size-8 items-center justify-center rounded-full bg-primary-subtle text-primary border border-primary/10 transition hover:bg-primary hover:text-primary-fg hover:scale-105 active:scale-95 shrink-0 shadow-xs"
                >
                  <svg
                    className="size-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                    />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </section>
      );
    },
  };
