import { twMerge } from "tailwind-merge";
import { AboutSection } from "@/components/ui/about-section";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselButton,
  CarouselHandler,
} from "@/components/ui/carousel";
import { CTASection } from "@/components/ui/cta-section";
import {
  Disclosure,
  DisclosureGroup,
  DisclosurePanel,
  DisclosureTrigger,
} from "@/components/ui/disclosure-group";
import { FeatureSection } from "@/components/ui/feature";
import { Heading } from "@/components/ui/heading";
import { Link } from "@/components/ui/link";
import { StatsGrid, StatItem } from "@/components/ui/stats";
import { StepsTimeline } from "@/components/ui/steps-timeline";
import { TestimonialsGrid, TestimonialCard } from "@/components/ui/testimonial";
import { Text } from "@/components/ui/text";
import { LucideIconRenderer } from "./shared";
import { getPuckBlockDomId } from "./shared";
import { getSurfaceClassName, puckSurfaceFields } from "./surface";
import type { PageBuilderComponentConfig } from "./types";

function getSectionLayoutPresetClass(preset: string | undefined): string {
  if (preset === "containedWide") {
    return "mx-auto w-full max-w-4xl";
  }

  return "";
}

// 1. ABOUT SECTION
export const AboutSectionComponentConfig: PageBuilderComponentConfig<"AboutSection"> =
  {
    label: "Khối giới thiệu",
    defaultProps: {
      badge: "Về đơn vị",
      header: "Giới thiệu Khoa Công nghệ thông tin",
      description:
        "Tìm hiểu về cơ cấu tổ chức, nhiệm vụ đào tạo và phương châm hoạt động của chúng tôi.",
      unitName: "Khoa Công nghệ thông tin - Trường Đại học Hàng hải Việt Nam",
      address:
        "Phòng 402, Nhà A5, Số 484 Lạch Tray, Kênh Dương, Lê Chân, Hải Phòng",
      phone: "0225.3735138",
      email: "fit@vimaru.edu.vn",
      imageUrl: "",
      surfaceTone: "transparent",
      surfaceBorder: "none",
      surfaceRadius: "none",
      surfacePadding: "none",
      surfaceShadow: "none",
      className: "",
    },
    fields: {
      ...puckSurfaceFields,
      badge: { type: "text", label: "Nhãn nhỏ" },
      header: { type: "text", label: "Tiêu đề lớn" },
      description: { type: "textarea", label: "Mô tả ngắn" },
      unitName: { type: "text", label: "Tên đơn vị học thuật" },
      address: { type: "text", label: "Địa chỉ văn phòng" },
      phone: { type: "text", label: "Số điện thoại liên hệ" },
      email: { type: "text", label: "Địa chỉ Email" },
      imageUrl: { type: "text", label: "Hình ảnh đại diện (URL)" },
      className: { type: "text", label: "Lớp CSS bổ sung" },
    },
    render: (props) => {
      const {
        className,
        surfaceTone,
        surfaceBorder,
        surfaceRadius,
        surfacePadding,
        surfaceShadow,
        ...sectionProps
      } = props;
      const id = getPuckBlockDomId(props.id);

      return (
        <div id={id}>
          <AboutSection
            className={twMerge(
              getSurfaceClassName(
                {
                  surfaceTone,
                  surfaceBorder,
                  surfaceRadius,
                  surfacePadding,
                  surfaceShadow,
                },
                "",
              ),
              className,
            )}
            {...sectionProps}
            fallbackIcon={
              <LucideIconRenderer
                name="School"
                className="size-16 opacity-55"
              />
            }
          />
        </div>
      );
    },
  };

// 2. FEATURE GRID
export const FeatureGridComponentConfig: PageBuilderComponentConfig<"FeatureGrid"> =
  {
    label: "Lưới thế mạnh",
    defaultProps: {
      badge: "Thế mạnh",
      header: "Tại Sao Nên Chọn FIT-VMU?",
      description:
        "Những ưu thế vượt trội tạo nên uy tín và chất lượng đào tạo hàng đầu của Khoa.",
      features: [
        {
          icon: "GraduationCap",
          title: "Chương Trình Đào Tạo Chuẩn",
          description:
            "Đào tạo cập nhật liên tục theo xu hướng công nghệ toàn cầu.",
        },
        {
          icon: "Users",
          title: "Giảng Viên Đầu Ngành",
          description:
            "Đội ngũ giảng viên có học vị cao, giàu kinh nghiệm thực tế.",
        },
        {
          icon: "Briefcase",
          title: "Liên Kết Doanh Nghiệp Rộng",
          description:
            "Hợp tác chặt chẽ mang đến cơ hội việc làm 100% cho sinh viên.",
        },
      ],
      columns: 3,
      surfaceTone: "transparent",
      surfaceBorder: "none",
      surfaceRadius: "none",
      surfacePadding: "none",
      surfaceShadow: "none",
      className: "",
    },
    fields: {
      ...puckSurfaceFields,
      badge: { type: "text", label: "Nhãn phụ" },
      header: { type: "text", label: "Tiêu đề chính" },
      description: { type: "textarea", label: "Mô tả ngắn" },
      columns: {
        type: "select",
        label: "Số cột hiển thị",
        options: [
          { label: "2 Cột", value: 2 },
          { label: "3 Cột", value: 3 },
          { label: "4 Cột", value: 4 },
        ],
      },
      features: {
        type: "array",
        label: "Danh sách thế mạnh",
        getItemSummary: (item) => item.title || "Thế mạnh",
        arrayFields: {
          icon: {
            type: "select",
            label: "Biểu tượng",
            options: [
              { label: "Mũ tốt nghiệp", value: "GraduationCap" },
              { label: "Sách mở", value: "BookOpen" },
              { label: "Người dùng", value: "Users" },
              { label: "Giải thưởng", value: "Award" },
              { label: "Cặp sách", value: "Briefcase" },
              { label: "Vi xử lý", value: "Cpu" },
              { label: "Địa cầu", value: "Globe" },
              { label: "Lịch", value: "Calendar" },
              { label: "Khiên", value: "Shield" },
              { label: "Dấu tích", value: "CheckCircle" },
            ],
          },
          title: { type: "text", label: "Tiêu đề thế mạnh" },
          description: { type: "textarea", label: "Mô tả ngắn" },
        },
      },
      className: { type: "text", label: "Lớp CSS bổ sung" },
    },
    render: (props) => {
      const {
        badge,
        header,
        description,
        features,
        columns,
        surfaceTone,
        surfaceBorder,
        surfaceRadius,
        surfacePadding,
        surfaceShadow,
        className,
      } = props;
      const id = getPuckBlockDomId((props as { id?: string }).id);

      return (
        <FeatureSection
          id={id}
          className={twMerge(
            getSurfaceClassName(
              {
                surfaceTone,
                surfaceBorder,
                surfaceRadius,
                surfacePadding,
                surfaceShadow,
              },
              "",
            ),
            className,
          )}
          badge={badge}
          header={header}
          description={description}
          features={features.map((feat) => ({
            title: feat.title,
            description: feat.description,
            icon: <LucideIconRenderer name={feat.icon} className="size-6" />,
          }))}
          columns={columns as 2 | 3 | 4}
        />
      );
    },
  };

// 3. STATS SECTION
export const StatsSectionComponentConfig: PageBuilderComponentConfig<"StatsSection"> =
  {
    label: "Số liệu thống kê",
    defaultProps: {
      badge: "Thành tích",
      header: "Những con số nổi bật",
      description:
        "FIT-VMU tự hào sở hữu những thành tích vượt trội trong đào tạo học thuật và nghiên cứu.",
      stats: [
        {
          value: "30+",
          label: "Năm truyền thống",
          trendValue: "1995-2026",
          isPositive: true,
        },
        {
          value: "98%",
          label: "Tỷ lệ có việc làm",
          trendValue: "+3%",
          isPositive: true,
        },
        {
          value: "50+",
          label: "Cán bộ giảng viên",
          trendValue: "100% ThS trở lên",
          isPositive: true,
        },
      ],
      surfaceTone: "transparent",
      surfaceBorder: "none",
      surfaceRadius: "none",
      surfacePadding: "none",
      surfaceShadow: "none",
      className: "",
    },
    fields: {
      ...puckSurfaceFields,
      badge: { type: "text", label: "Nhãn nhỏ" },
      header: { type: "text", label: "Tiêu đề" },
      description: { type: "textarea", label: "Mô tả ngắn" },
      stats: {
        type: "array",
        label: "Danh sách số liệu",
        getItemSummary: (item) => `${item.value}: ${item.label}`,
        arrayFields: {
          value: { type: "text", label: "Số liệu nổi bật" },
          label: { type: "text", label: "Nhãn chú thích" },
          trendValue: { type: "text", label: "Nhãn tăng trưởng (nếu có)" },
          isPositive: {
            type: "radio",
            label: "Tăng trưởng tích cực",
            options: [
              { label: "Có", value: true },
              { label: "Không", value: false },
            ],
          },
        },
      },
      className: { type: "text", label: "Lớp CSS bổ sung" },
    },
    render: (props) => {
      const {
        badge,
        header,
        description,
        stats,
        surfaceTone,
        surfaceBorder,
        surfaceRadius,
        surfacePadding,
        surfaceShadow,
        className,
      } = props;
      const id = getPuckBlockDomId((props as { id?: string }).id);

      return (
        <section
          id={id}
          className={twMerge(
            "space-y-8 py-8 w-full",
            getSurfaceClassName(
              {
                surfaceTone,
                surfaceBorder,
                surfaceRadius,
                surfacePadding,
                surfaceShadow,
              },
              "",
            ),
            className,
          )}
        >
          <div className="space-y-3 text-center">
            {badge && (
              <Badge
                intent="outline"
                isCircle={false}
                className="px-3 py-1 font-semibold uppercase tracking-wider text-[10px] border-primary/20 bg-primary-subtle/20 text-primary"
              >
                {badge}
              </Badge>
            )}
            <Heading
              level={2}
              className="text-3xl font-extrabold tracking-tight text-fg"
            >
              {header}
            </Heading>
            {description && (
              <Text className="mx-auto max-w-2xl text-base text-muted-fg leading-relaxed">
                {description}
              </Text>
            )}
          </div>

          <StatsGrid columns={stats.length as any} gap={6}>
            {stats.map((stat) => (
              <StatItem
                key={`${stat.label}:${stat.value}`}
                value={stat.value}
                label={stat.label}
                trend={
                  stat.trendValue
                    ? { value: stat.trendValue, isPositive: stat.isPositive }
                    : undefined
                }
              />
            ))}
          </StatsGrid>
        </section>
      );
    },
  };

// 4. CTA SECTION
export const CTASectionComponentConfig: PageBuilderComponentConfig<"CTASection"> =
  {
    label: "Kêu gọi hành động",
    defaultProps: {
      header: "Sẵn sàng gia nhập mái nhà chung FIT-VMU?",
      description:
        "Đăng ký tuyển sinh trực tuyến ngay hôm nay để nhận được lộ trình học tập chất lượng cao và cơ hội học bổng.",
      primaryActionLabel: "Xét tuyển trực tuyến",
      primaryActionHref: "#",
      secondaryActionLabel: "Tải cẩm nang tuyển sinh",
      secondaryActionHref: "#",
      layoutPreset: "default",
      align: "left",
      maxWidth: "none",
      surfaceTone: "transparent",
      surfaceBorder: "none",
      surfaceRadius: "none",
      surfacePadding: "none",
      surfaceShadow: "none",
      className: "",
    },
    fields: {
      ...puckSurfaceFields,
      header: { type: "text", label: "Tiêu đề" },
      description: { type: "textarea", label: "Mô tả ngắn" },
      primaryActionLabel: { type: "text", label: "Nút chính" },
      primaryActionHref: { type: "text", label: "Đường dẫn chính" },
      secondaryActionLabel: { type: "text", label: "Nút phụ" },
      secondaryActionHref: { type: "text", label: "Đường dẫn phụ" },
      layoutPreset: {
        type: "select",
        label: "Bố cục sẵn",
        options: [
          { label: "Mặc định", value: "default" },
          { label: "Canh giữa, giới hạn rộng", value: "containedWide" },
        ],
      },
      align: {
        type: "select",
        label: "Canh khối",
        options: [
          { label: "Trái", value: "left" },
          { label: "Giữa", value: "center" },
          { label: "Phải", value: "right" },
        ],
      },
      maxWidth: {
        type: "select",
        label: "Chiều rộng tối đa",
        options: [
          { label: "Không giới hạn", value: "none" },
          { label: "Rộng (4xl)", value: "4xl" },
        ],
      },
      className: { type: "text", label: "Lớp CSS bổ sung" },
    },
    render: (props) => {
      const {
        header,
        description,
        primaryActionLabel,
        primaryActionHref,
        secondaryActionLabel,
        secondaryActionHref,
        layoutPreset,
        align,
        maxWidth,
        surfaceTone,
        surfaceBorder,
        surfaceRadius,
        surfacePadding,
        surfaceShadow,
        className,
      } = props;
      const id = getPuckBlockDomId((props as { id?: string }).id);
      const alignClass = {
        left: "mr-auto ml-0",
        center: "mx-auto",
        right: "ml-auto mr-0",
      }[align || "left"];
      const maxWidthClass = {
        none: "",
        "4xl": "w-full max-w-4xl",
      }[maxWidth || "none"];

      return (
        <CTASection
          id={id}
          className={twMerge(
            getSurfaceClassName(
              {
                surfaceTone,
                surfaceBorder,
                surfaceRadius,
                surfacePadding,
                surfaceShadow,
              },
              "",
            ),
            getSectionLayoutPresetClass(layoutPreset),
            alignClass,
            maxWidthClass,
            className,
          )}
          header={header}
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

// 5. TIMELINE/STEPS SECTION
export const TimelineSectionComponentConfig: PageBuilderComponentConfig<"TimelineSection"> =
  {
    label: "Lộ trình & Quy trình",
    defaultProps: {
      badge: "Lộ trình",
      header: "Quy trình học tập & nghiên cứu",
      description:
        "Các bước đào tạo bài bản và toàn diện giúp sinh viên vững vàng kiến thức thực tế.",
      steps: [
        {
          title: "Năm 1: Đại cương & Cơ sở ngành",
          description:
            "Trang bị tư duy lập trình căn bản, kỹ năng mềm cốt lõi.",
        },
        {
          title: "Năm 2: Kiến thức nền tảng chuyên sâu",
          description:
            "Đi sâu cấu trúc dữ liệu, thuật toán, cơ sở dữ liệu và mạng máy tính.",
        },
        {
          title: "Năm 3: Dự án thực chiến & Chuyên ngành",
          description:
            "Làm đồ án phần mềm nhóm thực tế, chọn hướng chuyên môn sâu.",
        },
        {
          title: "Năm 4: Thực tập tốt nghiệp & Khóa luận",
          description:
            "Làm việc trực tế tại doanh nghiệp, hoàn thành khóa luận tốt nghiệp.",
        },
      ],
      surfaceTone: "transparent",
      surfaceBorder: "none",
      surfaceRadius: "none",
      surfacePadding: "none",
      surfaceShadow: "none",
      className: "",
    },
    fields: {
      ...puckSurfaceFields,
      badge: { type: "text", label: "Nhãn nhỏ" },
      header: { type: "text", label: "Tiêu đề" },
      description: { type: "textarea", label: "Mô tả" },
      steps: {
        type: "array",
        label: "Các bước thực hiện",
        getItemSummary: (item) => item.title || "Bước",
        arrayFields: {
          title: { type: "text", label: "Tiêu đề bước" },
          description: { type: "textarea", label: "Mô tả chi tiết" },
        },
      },
      className: { type: "text", label: "Lớp CSS bổ sung" },
    },
    render: (props) => {
      const {
        badge,
        header,
        description,
        steps,
        surfaceTone,
        surfaceBorder,
        surfaceRadius,
        surfacePadding,
        surfaceShadow,
        className,
      } = props;
      const id = getPuckBlockDomId((props as { id?: string }).id);

      return (
        <StepsTimeline
          id={id}
          className={twMerge(
            getSurfaceClassName(
              {
                surfaceTone,
                surfaceBorder,
                surfaceRadius,
                surfacePadding,
                surfaceShadow,
              },
              "",
            ),
            className,
          )}
          badge={badge}
          header={header}
          description={description}
          steps={steps}
        />
      );
    },
  };

// 6. FAQ SECTION
export const FAQSectionComponentConfig: PageBuilderComponentConfig<"FAQSection"> =
  {
    label: "Hỏi đáp thường gặp",
    defaultProps: {
      title: "Câu Hỏi Thường Gặp",
      description:
        "Các câu hỏi phổ biến từ học sinh, sinh viên và phụ huynh về chương trình đào tạo của khoa.",
      items: [
        {
          question: "Chỉ tiêu tuyển sinh của khoa thế nào?",
          answer:
            "Chỉ tiêu tuyển sinh hàng năm dao động từ 350-450 chỉ tiêu, được công bố chính thức trên website.",
        },
        {
          question: "Tỷ lệ sinh viên có việc làm sau khi tốt nghiệp ra sao?",
          answer:
            "Tỷ lệ sinh viên Khoa CNTT có việc làm đúng chuyên ngành trong vòng 6 tháng sau khi tốt nghiệp đạt trên 95% tại các tập đoàn công nghệ hàng đầu.",
        },
      ],
      surfaceTone: "transparent",
      surfaceBorder: "none",
      surfaceRadius: "none",
      surfacePadding: "none",
      surfaceShadow: "none",
      className: "",
    },
    fields: {
      ...puckSurfaceFields,
      title: { type: "text", label: "Tiêu đề" },
      description: { type: "textarea", label: "Mô tả ngắn" },
      items: {
        type: "array",
        label: "Danh sách câu hỏi & trả lời",
        getItemSummary: (item) => item.question || "Câu hỏi",
        arrayFields: {
          question: { type: "text", label: "Câu hỏi" },
          answer: { type: "textarea", label: "Câu trả lời" },
        },
      },
      className: { type: "text", label: "Lớp CSS bổ sung" },
    },
    render: (props) => {
      const {
        title,
        description,
        items,
        surfaceTone,
        surfaceBorder,
        surfaceRadius,
        surfacePadding,
        surfaceShadow,
        className,
      } = props;
      const id = getPuckBlockDomId(props.id);

      return (
        <section
          id={id}
          className={twMerge(
            "space-y-8 py-8 w-full",
            getSurfaceClassName(
              {
                surfaceTone,
                surfaceBorder,
                surfaceRadius,
                surfacePadding,
                surfaceShadow,
              },
              "",
            ),
            className,
          )}
        >
          <div className="space-y-3 text-center">
            <Badge
              intent="outline"
              isCircle={false}
              className="px-3 py-1 font-semibold uppercase tracking-wider text-[10px] border-primary/20 bg-primary-subtle/20 text-primary"
            >
              FAQ
            </Badge>
            <Heading
              level={2}
              className="text-3xl font-extrabold tracking-tight text-fg"
            >
              {title}
            </Heading>
            {description && (
              <Text className="mx-auto max-w-2xl text-base text-muted-fg leading-relaxed">
                {description}
              </Text>
            )}
          </div>

          <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-overlay p-6 shadow-xs hover:shadow-md transition duration-300">
            <DisclosureGroup>
              {items.map((item) => (
                <Disclosure key={item.question}>
                  <DisclosureTrigger>{item.question}</DisclosureTrigger>
                  <DisclosurePanel>
                    <Text className="text-sm/6 text-muted-fg whitespace-pre-line leading-relaxed">
                      {item.answer}
                    </Text>
                  </DisclosurePanel>
                </Disclosure>
              ))}
            </DisclosureGroup>
          </div>
        </section>
      );
    },
  };

// 7. TESTIMONIAL SECTION
export const TestimonialSectionComponentConfig: PageBuilderComponentConfig<"TestimonialSection"> =
  {
    label: "Đánh giá & Cảm nhận",
    defaultProps: {
      badge: "Cựu Sinh Viên Thành Đạt",
      header: "Sinh viên nói gì về chúng tôi?",
      description:
        "Ý kiến đóng góp từ các thế hệ cựu sinh viên đã học tập, trưởng thành và thành công từ FIT-VMU.",
      testimonials: [
        {
          name: "Phạm Văn Minh",
          roleAndCompany: "Senior Software Engineer (FPT Software)",
          content:
            "Những năm tháng học tập tại đây giúp tôi xây dựng vững chắc tư duy giải quyết vấn đề và tự tin hòa nhập vào môi trường công nghệ toàn cầu.",
          avatar: "",
        },
        {
          name: "Nguyễn Thị Mai",
          roleAndCompany: "Data Analyst (Viettel Telecom)",
          content:
            "Giảng viên cực kỳ nhiệt tình, luôn thúc đẩy và hướng dẫn sinh viên tham gia các đề tài nghiên cứu khoa học thực tế.",
          avatar: "",
        },
      ],
      surfaceTone: "transparent",
      surfaceBorder: "none",
      surfaceRadius: "none",
      surfacePadding: "none",
      surfaceShadow: "none",
      className: "",
    },
    fields: {
      ...puckSurfaceFields,
      badge: { type: "text", label: "Nhãn nhỏ" },
      header: { type: "text", label: "Tiêu đề lớn" },
      description: { type: "textarea", label: "Mô tả ngắn" },
      testimonials: {
        type: "array",
        label: "Danh sách đánh giá",
        getItemSummary: (item) => item.name || "Cựu sinh viên",
        arrayFields: {
          name: { type: "text", label: "Họ và tên" },
          roleAndCompany: { type: "text", label: "Chức vụ & Doanh nghiệp" },
          content: { type: "textarea", label: "Nội dung chia sẻ" },
          avatar: { type: "text", label: "Ảnh đại diện (URL)" },
        },
      },
      className: { type: "text", label: "Lớp CSS bổ sung" },
    },
    render: (props) => {
      const {
        badge,
        header,
        description,
        testimonials,
        surfaceTone,
        surfaceBorder,
        surfaceRadius,
        surfacePadding,
        surfaceShadow,
        className,
      } = props;
      const id = getPuckBlockDomId((props as { id?: string }).id);

      return (
        <section
          id={id}
          className={twMerge(
            "space-y-8 py-8 w-full",
            getSurfaceClassName(
              {
                surfaceTone,
                surfaceBorder,
                surfaceRadius,
                surfacePadding,
                surfaceShadow,
              },
              "",
            ),
            className,
          )}
        >
          <div className="space-y-3 text-center">
            {badge && (
              <Badge
                intent="outline"
                isCircle={false}
                className="px-3 py-1 font-semibold uppercase tracking-wider text-[10px] border-primary/20 bg-primary-subtle/20 text-primary"
              >
                {badge}
              </Badge>
            )}
            <Heading
              level={2}
              className="text-3xl font-extrabold tracking-tight text-fg"
            >
              {header}
            </Heading>
            {description && (
              <Text className="mx-auto max-w-2xl text-base text-muted-fg leading-relaxed">
                {description}
              </Text>
            )}
          </div>

          <TestimonialsGrid columns={2} gap={6}>
            {testimonials.map((testimonial) => (
              <TestimonialCard
                key={`${testimonial.name}:${testimonial.roleAndCompany}`}
                name={testimonial.name}
                role={testimonial.roleAndCompany}
                content={testimonial.content}
                avatarUrl={testimonial.avatar}
              />
            ))}
          </TestimonialsGrid>
        </section>
      );
    },
  };

// 8. CAROUSEL SECTION
export const CarouselSectionComponentConfig: PageBuilderComponentConfig<"CarouselSection"> =
  {
    label: "Trình chiếu ảnh",
    defaultProps: {
      badge: "Thư viện ảnh",
      header: "Hình ảnh hoạt động nổi bật",
      description:
        "Nhìn lại những khoảnh khắc sinh động về các buổi hội thảo khoa học, câu lạc bộ và các cuộc thi học thuật.",
      items: [
        {
          imageUrl: "",
          title: "Hội nghị Nghiên cứu khoa học sinh viên",
          description:
            "Sân chơi học thuật bổ ích thúc đẩy đổi mới sáng tạo trong sinh viên.",
          linkUrl: "#",
        },
        {
          imageUrl: "",
          title: "Lễ tốt nghiệp & Trao bằng Kỹ sư",
          description:
            "Chúc mừng các tân kỹ sư CNTT chính thức hoàn thành hành trình 4 năm.",
          linkUrl: "#",
        },
        {
          imageUrl: "",
          title: "Giải bóng đá vô địch Khoa CNTT",
          description:
            "Hoạt động thể thao thường niên gắn kết tình đoàn kết tập thể cán bộ SV.",
          linkUrl: "#",
        },
      ],
      surfaceTone: "transparent",
      surfaceBorder: "none",
      surfaceRadius: "none",
      surfacePadding: "none",
      surfaceShadow: "none",
      className: "",
    },
    fields: {
      ...puckSurfaceFields,
      badge: { type: "text", label: "Nhãn nhỏ" },
      header: { type: "text", label: "Tiêu đề chính" },
      description: { type: "textarea", label: "Mô tả ngắn" },
      items: {
        type: "array",
        label: "Các thẻ trình chiếu",
        getItemSummary: (item) => item.title || "Slide",
        arrayFields: {
          imageUrl: { type: "text", label: "Ảnh nền slide (URL)" },
          title: { type: "text", label: "Tiêu đề slide" },
          description: { type: "textarea", label: "Mô tả chi tiết" },
          linkUrl: { type: "text", label: "Đường dẫn liên kết" },
        },
      },
      className: { type: "text", label: "Lớp CSS bổ sung" },
    },
    render: (props) => {
      const {
        badge,
        header,
        description,
        items,
        surfaceTone,
        surfaceBorder,
        surfaceRadius,
        surfacePadding,
        surfaceShadow,
        className,
      } = props;
      const id = getPuckBlockDomId((props as { id?: string }).id);

      return (
        <section
          id={id}
          className={twMerge(
            "space-y-8 py-8 w-full relative",
            getSurfaceClassName(
              {
                surfaceTone,
                surfaceBorder,
                surfaceRadius,
                surfacePadding,
                surfaceShadow,
              },
              "",
            ),
            className,
          )}
        >
          <div className="space-y-3 text-center">
            {badge && (
              <Badge
                intent="outline"
                isCircle={false}
                className="px-3 py-1 font-semibold uppercase tracking-wider text-[10px] border-primary/20 bg-primary-subtle/20 text-primary"
              >
                {badge}
              </Badge>
            )}
            <Heading
              level={2}
              className="text-3xl font-extrabold tracking-tight text-fg"
            >
              {header}
            </Heading>
            {description && (
              <Text className="mx-auto max-w-2xl text-base text-muted-fg leading-relaxed">
                {description}
              </Text>
            )}
          </div>

          <div className="mx-auto max-w-5xl">
            <Carousel opts={{ loop: true, align: "start" }} className="w-full">
              <CarouselContent>
                {items.map((item) => (
                  <CarouselItem
                    key={`${item.title}:${item.imageUrl ?? "placeholder"}`}
                    className="md:basis-1/2 lg:basis-1/2 p-2"
                  >
                    <Card className="border-border bg-overlay py-0 shadow-xs h-full flex flex-col justify-between group">
                      <div className="relative aspect-video w-full overflow-hidden bg-muted">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-primary-subtle/20 text-primary">
                            <svg
                              className="size-12 opacity-30"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={1.5}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-6 flex-1 flex flex-col gap-3 justify-between">
                        <div className="space-y-1.5">
                          <Heading
                            level={3}
                            className="text-lg font-bold text-fg group-hover:text-primary transition-colors"
                          >
                            {item.title}
                          </Heading>
                          <Text className="text-xs/relaxed text-muted-fg leading-relaxed">
                            {item.description}
                          </Text>
                        </div>
                        {item.linkUrl && (
                          <div className="pt-2">
                            <Link
                              href={item.linkUrl}
                              className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                            >
                              Xem thêm
                              <svg
                                className="size-3 transition duration-200 group-hover:translate-x-0.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </Link>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselHandler className="justify-center mt-6">
                <CarouselButton segment="previous" />
                <CarouselButton segment="next" />
              </CarouselHandler>
            </Carousel>
          </div>
        </section>
      );
    },
  };
