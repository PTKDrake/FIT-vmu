import { twMerge } from "tailwind-merge";
import { Badge } from "@/components/ui/badge";
import { Card as CardUI, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Link } from "@/components/ui/link";
import { Note as NoteUI } from "@/components/ui/note";
import { Text } from "@/components/ui/text";
import type { PageBuilderComponentConfig } from "./types";

// 1. HEADING BLOCK
export const HeadingComponentConfig: PageBuilderComponentConfig<"Heading"> = {
  label: "Tiêu đề",
  defaultProps: {
    title: "Tiêu đề nội dung",
    subtitle: "",
    level: 2,
    alignment: "left",
    className: "",
  },
  fields: {
    title: { type: "text", label: "Tiêu đề chính" },
    subtitle: { type: "text", label: "Tiêu đề phụ" },
    level: {
      type: "select",
      label: "Cấp độ",
      options: [
        { label: "Cấp độ 1 (Lớn nhất)", value: 1 },
        { label: "Cấp độ 2 (Chính)", value: 2 },
        { label: "Cấp độ 3 (Phụ)", value: 3 },
        { label: "Cấp độ 4 (Nhỏ)", value: 4 },
      ],
    },
    alignment: {
      type: "select",
      label: "Căn lề",
      options: [
        { label: "Trái", value: "left" },
        { label: "Giữa", value: "center" },
        { label: "Phải", value: "right" },
      ],
    },
    className: { type: "text", label: "Lớp CSS bổ sung" },
  },
  render: ({ title, subtitle, level, alignment, className }) => {
    const alignClass = {
      left: "text-left",
      center: "text-center mx-auto",
      right: "text-right ml-auto",
    }[alignment];

    return (
      <div className={twMerge("space-y-1.5 w-full", alignClass, className)}>
        <Heading
          level={level}
          className={twMerge(
            "font-extrabold tracking-tight text-fg leading-tight",
            level === 1 && "text-3xl sm:text-4xl lg:text-5xl",
            level === 2 && "text-2xl sm:text-3xl",
            level === 3 && "text-xl sm:text-2xl",
            level === 4 && "text-lg font-bold",
          )}
        >
          {title}
        </Heading>
        {subtitle && (
          <p className="text-sm font-medium text-muted-fg leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    );
  },
};

// 2. RICH TEXT BLOCK
export const RichTextComponentConfig: PageBuilderComponentConfig<"RichText"> = {
  label: "Văn bản định dạng",
  defaultProps: {
    body: "<p>Nhập nội dung văn bản định dạng tại đây để hiển thị đầy đủ thông tin...</p>",
    className: "",
  },
  fields: {
    body: { type: "textarea", label: "Nội dung" },
    className: { type: "text", label: "Lớp CSS bổ sung" },
  },
  render: ({ body, className }) => {
    return (
      <div
        className={twMerge(
          "prose prose-sm sm:prose max-w-full text-fg leading-relaxed *:mb-4 last:*:mb-0 focus:outline-hidden",
          className,
        )}
        dangerouslySetInnerHTML={{ __html: body || "" }}
      />
    );
  },
};

// 3. IMAGE BLOCK
export const ImageComponentConfig: PageBuilderComponentConfig<"Image"> = {
  label: "Hình ảnh",
  defaultProps: {
    imageUrl: "",
    alt: "Hình ảnh minh họa",
    caption: "",
    objectFit: "cover",
    rounded: true,
    className: "",
  },
  fields: {
    imageUrl: { type: "text", label: "Đường dẫn ảnh" },
    alt: { type: "text", label: "Mô tả ảnh" },
    caption: { type: "text", label: "Chú thích ảnh" },
    objectFit: {
      type: "select",
      label: "Chế độ hiển thị",
      options: [
        { label: "Lấp đầy khung", value: "cover" },
        { label: "Chứa trọn vẹn", value: "contain" },
      ],
    },
    rounded: {
      type: "radio",
      label: "Bo góc tròn",
      options: [
        { label: "Có", value: true },
        { label: "Không", value: false },
      ],
    },
    className: { type: "text", label: "Lớp CSS bổ sung" },
  },
  render: ({ imageUrl, alt, caption, objectFit, rounded, className }) => {
    return (
      <figure
        className={twMerge("w-full text-center space-y-2 group", className)}
      >
        <div
          className={twMerge(
            "relative overflow-hidden border border-border/80 bg-muted/30 mx-auto aspect-video max-h-[480px] w-full",
            rounded ? "rounded-3xl" : "rounded-none",
          )}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={alt}
              className={twMerge(
                "w-full h-full object-center transition duration-500 group-hover:scale-[1.02]",
                objectFit === "cover" ? "object-cover" : "object-contain",
              )}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-fg gap-2">
              <svg
                className="size-16 opacity-30"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
              <span className="text-xs font-medium">
                Bấm để điền đường dẫn ảnh
              </span>
            </div>
          )}
        </div>
        {caption && (
          <figcaption className="text-xs text-muted-fg font-medium italic">
            {caption}
          </figcaption>
        )}
      </figure>
    );
  },
};

// 4. IMAGE & TEXT BLOCK
export const ImageTextComponentConfig: PageBuilderComponentConfig<"ImageText"> =
  {
    label: "Ảnh kèm văn bản",
    defaultProps: {
      imageUrl: "",
      alt: "Hình ảnh",
      title: "Tiêu đề khối nội dung",
      description:
        "Nhập nội dung mô tả chi tiết đi kèm với hình ảnh ở bên cạnh.",
      imagePosition: "left",
      className: "",
    },
    fields: {
      imageUrl: { type: "text", label: "Đường dẫn ảnh" },
      alt: { type: "text", label: "Mô tả ảnh" },
      title: { type: "text", label: "Tiêu đề" },
      description: { type: "textarea", label: "Nội dung văn bản" },
      imagePosition: {
        type: "select",
        label: "Vị trí ảnh",
        options: [
          { label: "Bên trái", value: "left" },
          { label: "Bên phải", value: "right" },
        ],
      },
      className: { type: "text", label: "Lớp CSS bổ sung" },
    },
    render: ({
      imageUrl,
      alt,
      title,
      description,
      imagePosition,
      className,
    }) => {
      return (
        <div
          className={twMerge(
            "grid items-center gap-8 md:grid-cols-2 py-4",
            className,
          )}
        >
          <div
            className={twMerge(
              "space-y-4",
              imagePosition === "right" ? "md:order-1" : "md:order-2",
            )}
          >
            <Heading level={3} className="text-2xl font-bold text-fg">
              {title}
            </Heading>
            <Text className="text-sm/relaxed text-muted-fg leading-relaxed whitespace-pre-line">
              {description}
            </Text>
          </div>

          <div
            className={twMerge(
              "relative w-full aspect-video md:aspect-[4/3] rounded-3xl overflow-hidden border border-border/80 bg-muted/20 shadow-xs group",
              imagePosition === "right" ? "md:order-2" : "md:order-1",
            )}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={alt || title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted-fg">
                <svg
                  className="size-16 opacity-30"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1}
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
        </div>
      );
    },
  };

// 5. BUTTON BLOCK
export const ButtonComponentConfig: PageBuilderComponentConfig<"Button"> = {
  label: "Nút nhấn",
  defaultProps: {
    text: "Hành động chính",
    url: "#",
    variant: "primary",
    size: "md",
    openInNewTab: false,
    className: "",
  },
  fields: {
    text: { type: "text", label: "Nhãn nút" },
    url: { type: "text", label: "Đường dẫn" },
    variant: {
      type: "select",
      label: "Kiểu dáng",
      options: [
        { label: "Nổi bật", value: "primary" },
        { label: "Phụ", value: "secondary" },
        { label: "Viền ngoài", value: "outline" },
        { label: "Phẳng", value: "plain" },
      ],
    },
    size: {
      type: "select",
      label: "Kích thước",
      options: [
        { label: "Nhỏ", value: "sm" },
        { label: "Vừa", value: "md" },
        { label: "Lớn", value: "lg" },
      ],
    },
    openInNewTab: {
      type: "radio",
      label: "Mở trong tab mới",
      options: [
        { label: "Có", value: true },
        { label: "Không", value: false },
      ],
    },
    className: { type: "text", label: "Lớp CSS bổ sung" },
  },
  render: ({ text, url, variant, size, openInNewTab, className }) => {
    const variantClass = {
      primary: "bg-primary text-primary-fg hover:bg-primary/95",
      secondary: "bg-secondary text-secondary-fg hover:bg-secondary/90",
      outline: "border border-border bg-bg text-fg hover:bg-secondary",
      plain: "text-primary hover:underline bg-transparent px-2 min-h-0 py-0",
    }[variant];

    const sizeClass = {
      sm: "px-3 py-1.5 text-xs rounded-lg min-h-9",
      md: "px-5 py-2.5 text-sm rounded-full min-h-11",
      lg: "px-7 py-3 text-base rounded-full min-h-[50px] font-semibold",
    }[size];

    return (
      <div className={twMerge("inline-block py-1", className)}>
        <Link
          href={url || "#"}
          target={openInNewTab ? "_blank" : undefined}
          rel={openInNewTab ? "noopener noreferrer" : undefined}
          className={twMerge(
            "inline-flex items-center justify-center font-medium transition duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-xs shrink-0",
            variantClass,
            sizeClass,
          )}
        >
          {text}
        </Link>
      </div>
    );
  },
};

// 6. BUTTON GROUP BLOCK
export const ButtonGroupComponentConfig: PageBuilderComponentConfig<"ButtonGroup"> =
  {
    label: "Nhóm nút",
    defaultProps: {
      buttons: [
        {
          text: "Đăng ký tuyển sinh",
          url: "#",
          variant: "primary",
          size: "md",
          openInNewTab: false,
        },
        {
          text: "Tìm hiểu thêm",
          url: "#",
          variant: "outline",
          size: "md",
          openInNewTab: false,
        },
      ],
      className: "",
    },
    fields: {
      buttons: {
        type: "array",
        label: "Danh sách nút nhấn",
        getItemSummary: (item) => item.text || "Nút bấm",
        arrayFields: {
          text: { type: "text", label: "Nhãn nút" },
          url: { type: "text", label: "Đường dẫn" },
          variant: {
            type: "select",
            label: "Kiểu dáng",
            options: [
              { label: "Nổi bật", value: "primary" },
              { label: "Phụ", value: "secondary" },
              { label: "Viền", value: "outline" },
              { label: "Phẳng", value: "plain" },
            ],
          },
          size: {
            type: "select",
            label: "Kích thước",
            options: [
              { label: "Nhỏ", value: "sm" },
              { label: "Vừa", value: "md" },
              { label: "Lớn", value: "lg" },
            ],
          },
          openInNewTab: {
            type: "radio",
            label: "Mở trong tab mới",
            options: [
              { label: "Có", value: true },
              { label: "Không", value: false },
            ],
          },
        },
      },
      className: { type: "text", label: "Lớp CSS bổ sung" },
    },
    render: ({ buttons, className }) => {
      return (
        <div
          className={twMerge(
            "flex flex-wrap gap-3 items-center py-2",
            className,
          )}
        >
          {buttons.map((btn, index) => {
            const variantClass = {
              primary: "bg-primary text-primary-fg hover:bg-primary/95",
              secondary: "bg-secondary text-secondary-fg hover:bg-secondary/90",
              outline: "border border-border bg-bg text-fg hover:bg-secondary",
              plain:
                "text-primary hover:underline bg-transparent px-2 min-h-0 py-0",
            }[btn.variant];

            const sizeClass = {
              sm: "px-3 py-1.5 text-xs rounded-lg min-h-9",
              md: "px-5 py-2.5 text-sm rounded-full min-h-11",
              lg: "px-7 py-3 text-base rounded-full min-h-[50px] font-semibold",
            }[btn.size];

            return (
              <Link
                key={index}
                href={btn.url || "#"}
                target={btn.openInNewTab ? "_blank" : undefined}
                rel={btn.openInNewTab ? "noopener noreferrer" : undefined}
                className={twMerge(
                  "inline-flex items-center justify-center font-medium transition duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-xs shrink-0",
                  variantClass,
                  sizeClass,
                )}
              >
                {btn.text}
              </Link>
            );
          })}
        </div>
      );
    },
  };

// 7. CARD BLOCK
export const CardComponentConfig: PageBuilderComponentConfig<"Card"> = {
  label: "Hộp thông tin",
  defaultProps: {
    title: "Tiêu đề thẻ thông tin",
    description: "Nhập đoạn mô tả tóm tắt cho thẻ thông tin ở đây.",
    imageUrl: "",
    linkUrl: "#",
    linkLabel: "Xem chi tiết",
    className: "",
  },
  fields: {
    title: { type: "text", label: "Tiêu đề thẻ" },
    description: { type: "textarea", label: "Mô tả ngắn" },
    imageUrl: { type: "text", label: "Ảnh đại diện (URL)" },
    linkUrl: { type: "text", label: "Đường dẫn hành động" },
    linkLabel: { type: "text", label: "Nhãn hành động" },
    className: { type: "text", label: "Lớp CSS bổ sung" },
  },
  render: ({ title, description, imageUrl, linkUrl, linkLabel, className }) => {
    return (
      <CardUI
        className={twMerge(
          "max-w-md w-full overflow-hidden rounded-3xl border border-border bg-overlay py-0 shadow-xs transition duration-300 hover:shadow-md hover:border-primary/15 group",
          className,
        )}
      >
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary-subtle/20 text-primary">
              <svg
                className="size-14 opacity-30"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
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
        <CardContent className="space-y-4 p-6">
          <div className="space-y-2">
            <Heading
              level={3}
              className="text-xl font-bold tracking-tight text-fg group-hover:text-primary transition-colors"
            >
              {title}
            </Heading>
            <Text className="text-sm/relaxed text-muted-fg leading-relaxed">
              {description}
            </Text>
          </div>
          {linkLabel && (
            <div className="pt-2">
              <Link
                href={linkUrl || "#"}
                className="inline-flex min-h-9 items-center justify-center rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-fg hover:bg-primary/95 transition duration-200 shadow-sm"
              >
                {linkLabel}
              </Link>
            </div>
          )}
        </CardContent>
      </CardUI>
    );
  },
};

// 8. NOTE BLOCK
export const NoteComponentConfig: PageBuilderComponentConfig<"Note"> = {
  label: "Chú ý",
  defaultProps: {
    title: "Thông báo quan trọng",
    body: "Vui lòng hoàn thiện đúng thời hạn quy định học thuật của Nhà trường.",
    intent: "info",
    className: "",
  },
  fields: {
    title: { type: "text", label: "Tiêu đề ghi chú" },
    body: { type: "textarea", label: "Nội dung ghi chú" },
    intent: {
      type: "select",
      label: "Loại chú ý",
      options: [
        { label: "Thông tin", value: "info" },
        { label: "Khuyên dùng", value: "success" },
        { label: "Cảnh báo", value: "warning" },
        { label: "Nguy hiểm", value: "danger" },
      ],
    },
    className: { type: "text", label: "Lớp CSS bổ sung" },
  },
  render: ({ title, body, intent, className }) => {
    return (
      <NoteUI
        intent={intent}
        indicator={true}
        className={twMerge("my-2", className)}
      >
        <div className="space-y-1">
          {title && (
            <h5 className="font-bold text-sm tracking-tight">{title}</h5>
          )}
          <p className="text-xs/relaxed opacity-90">{body}</p>
        </div>
      </NoteUI>
    );
  },
};

// 9. BADGE LIST BLOCK
export const BadgeListComponentConfig: PageBuilderComponentConfig<"BadgeList"> =
  {
    label: "Danh sách nhãn",
    defaultProps: {
      badges: [
        { text: "Tuyển sinh 2026", intent: "primary" },
        { text: "Chính quy", intent: "success" },
        { text: "Hot", intent: "danger" },
      ],
      className: "",
    },
    fields: {
      badges: {
        type: "array",
        label: "Danh sách các nhãn",
        getItemSummary: (item) => item.text || "Nhãn",
        arrayFields: {
          text: { type: "text", label: "Văn bản nhãn" },
          intent: {
            type: "select",
            label: "Màu nhãn",
            options: [
              { label: "Xanh dương", value: "primary" },
              { label: "Màu xám", value: "secondary" },
              { label: "Xanh lá", value: "success" },
              { label: "Màu trời", value: "info" },
              { label: "Màu cam", value: "warning" },
              { label: "Màu đỏ", value: "danger" },
              { label: "Không nền", value: "outline" },
            ],
          },
        },
      },
      className: { type: "text", label: "Lớp CSS bổ sung" },
    },
    render: ({ badges, className }) => {
      return (
        <div className={twMerge("flex flex-wrap gap-2 py-2", className)}>
          {badges.map((badge, index) => (
            <Badge
              key={index}
              intent={badge.intent}
              isCircle={false}
              className="px-3 py-1 font-semibold uppercase tracking-wider text-[10px]"
            >
              {badge.text}
            </Badge>
          ))}
        </div>
      );
    },
  };

// 10. TAG LIST BLOCK
export const TagListComponentConfig: PageBuilderComponentConfig<"TagList"> = {
  label: "Danh sách từ khóa",
  defaultProps: {
    tags: [
      { text: "Công nghệ thông tin" },
      { text: "Tuyển sinh" },
      { text: "Hải Phòng" },
    ],
    className: "",
  },
  fields: {
    tags: {
      type: "array",
      label: "Danh sách các tag",
      getItemSummary: (item) => item.text || "Từ khóa",
      arrayFields: {
        text: { type: "text", label: "Tên tag" },
      },
    },
    className: { type: "text", label: "Lớp CSS bổ sung" },
  },
  render: ({ tags, className }) => {
    return (
      <div className={twMerge("flex flex-wrap gap-1.5 py-2", className)}>
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-x-1 py-0.5 px-2 font-medium text-xs rounded-full bg-secondary text-secondary-fg border border-border/80 cursor-default hover:bg-secondary/80 transition"
          >
            #{tag.text}
          </span>
        ))}
      </div>
    );
  },
};
