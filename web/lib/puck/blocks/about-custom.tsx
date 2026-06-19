import { AboutCustom } from "@/components/cms/about-custom";
import { getPuckBlockDomId } from "./shared";
import type { PageBuilderComponentConfig } from "./types";

export const AboutCustomComponentConfig: PageBuilderComponentConfig<"AboutFeature"> =
  {
    label: "Khối giới thiệu nâng cao",
    defaultProps: {
      badge: "• Về chúng tôi",
      title: "Giới thiệu khoa",
      imageUrl: "",
      mobileHighlightText:
        "Khoa Công nghệ thông tin – Trường Đại học Hàng hải Việt Nam thành lập ngày 16/12/1997, là một trong 5 khoa CNTT đầu tiên tại Việt Nam.",
      aboutDescription:
        "Khoa Công nghệ thông tin – Trường Đại học Hàng hải Việt Nam là đơn vị đào tạo, nghiên cứu và chuyển giao tri thức hàng đầu trong lĩnh vực công nghệ thông tin, góp phần đào tạo nguồn nhân lực chất lượng cao, đáp ứng yêu cầu của thời đại số và hội nhập quốc tế.",
      features: [
        {
          icon: "Users",
          title: "Đội ngũ giảng viên giàu kinh nghiệm",
          description:
            "Giảng viên giàu kinh nghiệm, tận tâm và đạt nhiều thành tích nổi bật.",
        },
        {
          icon: "Award",
          title: "Chương trình đào tạo cập nhật",
          description:
            "Chương trình đào tạo hiện đại, cập nhật liên tục theo xu hướng thế giới.",
        },
        {
          icon: "BookOpen",
          title: "Cơ sở vật chất hiện đại",
          description:
            "Phòng máy tính cấu hình cao, phòng Lab nghiên cứu hiện đại.",
        },
        {
          icon: "TrendingUp",
          title: "Kết nối doanh nghiệp rộng mở",
          description:
            "Hợp tác chặt chẽ với các doanh nghiệp, cơ hội việc làm 100%.",
        },
      ],
      cardTitle: "Khoa Công nghệ thông tin",
      cardSubtitle: "Trường Đại học Hàng hải Việt Nam",
      cardHighlightText:
        "Nơi ươm mầm tài năng công nghệ, kiến tạo tương lai số, vươn tầm quốc tế.",
      address: "Phòng 301, Nhà A3, 484 Lạch Tray, Ngô Quyền, Hải Phòng",
      phone: "0225 3783 138",
      email: "fit@vimaru.edu.vn",
      website: "https://fit.vimaru.edu.vn",
      buttonLabel: "Xem thêm về khoa",
      buttonHref: "#",
      imageMaxHeight: "sm",
      className: "",
    },
    fields: {
      badge: { type: "text", label: "Nhãn nhỏ" },
      title: { type: "text", label: "Tiêu đề chính" },
      imageUrl: { type: "cmsMedia" as any, label: "Hình ảnh chính" },
      imageMaxHeight: {
        type: "select",
        label: "Chiều cao tối đa ảnh",
        options: [
          { label: "Thấp nhất", value: "50" },
          { label: "Rất thấp", value: "xs" },
          { label: "Thấp", value: "sm" },
          { label: "Vừa", value: "md" },
          { label: "Cao", value: "lg" },
          { label: "Rất cao", value: "xl" },
          { label: "Không giới hạn", value: "none" },
        ],
      },
      mobileHighlightText: {
        type: "textarea",
        label: "Mô tả nổi bật trên Mobile (trong card xanh)",
      },
      aboutDescription: {
        type: "textarea",
        label: "Mô tả giới thiệu trên Desktop",
      },
      features: {
        type: "array",
        label: "Đặc điểm nổi bật",
        getItemSummary: (item) => item.title || "Đặc điểm",
        arrayFields: {
          icon: {
            type: "select",
            label: "Biểu tượng",
            options: [
              {
                label: "Mũ tốt nghiệp (GraduationCap)",
                value: "GraduationCap",
              },
              { label: "Giải thưởng (Award)", value: "Award" },
              { label: "Sách mở (BookOpen)", value: "BookOpen" },
              { label: "Thống kê (TrendingUp)", value: "TrendingUp" },
              { label: "Người dùng (Users)", value: "Users" },
              { label: "Cặp sách (Briefcase)", value: "Briefcase" },
              { label: "Trường học (School)", value: "School" },
              { label: "Địa cầu (Globe)", value: "Globe" },
            ],
          },
          title: { type: "text", label: "Tiêu đề" },
          description: {
            type: "textarea",
            label: "Mô tả chi tiết (chỉ hiện trên Desktop)",
          },
        },
      },
      cardTitle: { type: "text", label: "Tiêu đề thẻ liên hệ (phải)" },
      cardSubtitle: { type: "text", label: "Phụ đề thẻ liên hệ (phải)" },
      cardHighlightText: {
        type: "textarea",
        label: "Khẩu hiệu thẻ liên hệ (phải)",
      },
      address: { type: "text", label: "Địa chỉ liên hệ" },
      phone: { type: "text", label: "Điện thoại liên hệ" },
      email: { type: "text", label: "Email liên hệ" },
      website: { type: "text", label: "Website liên hệ" },
      buttonLabel: { type: "text", label: "Nhãn nút liên kết" },
      buttonHref: { type: "text", label: "Đường dẫn nút liên kết" },
      className: { type: "text", label: "Lớp CSS bổ sung" },
    },
    render: (props) => {
      const {
        badge,
        title,
        imageUrl,
        imageMaxHeight,
        mobileHighlightText,
        aboutDescription,
        features,
        cardTitle,
        cardSubtitle,
        cardHighlightText,
        address,
        phone,
        email,
        website,
        buttonLabel,
        buttonHref,
        className,
      } = props;
      const id = getPuckBlockDomId((props as { id?: string }).id);

      return (
        <div id={id} className="w-full">
          <AboutCustom
            badge={badge}
            title={title}
            imageUrl={imageUrl}
            imageMaxHeight={imageMaxHeight}
            mobileHighlightText={mobileHighlightText}
            aboutDescription={aboutDescription}
            features={features}
            cardTitle={cardTitle}
            cardSubtitle={cardSubtitle}
            cardHighlightText={cardHighlightText}
            address={address}
            phone={phone}
            email={email}
            website={website}
            buttonLabel={buttonLabel}
            buttonHref={buttonHref}
            className={className}
          />
        </div>
      );
    },
  };
