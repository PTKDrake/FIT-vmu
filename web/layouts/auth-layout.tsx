import type { ReactNode } from "react";
import GuestLayout from "@/layouts/guest-layout";

export const authLayoutProps: Record<
  string,
  {
    description: string;
    header: string;
  }
> = {
  "auth/login": {
    header: "Đăng nhập vào tài khoản",
    description: "Nhập email của bạn bên dưới để đăng nhập vào tài khoản.",
  },
  "auth/register": {
    header: "Tạo tài khoản",
    description: "Điền thông tin bên dưới để tạo tài khoản của bạn.",
  },
  "auth/forgot-password": {
    header: "Quên mật khẩu",
    description:
      "Nhập địa chỉ email của bạn và chúng tôi sẽ gửi liên kết đặt lại mật khẩu.",
  },
  "auth/reset-password": {
    header: "Đặt lại mật khẩu",
    description: "Chọn một mật khẩu mới cho tài khoản của bạn.",
  },
  "auth/confirm-password": {
    header: "Xác nhận mật khẩu",
    description: "Vui lòng xác nhận mật khẩu của bạn trước khi tiếp tục.",
  },
  "auth/verify-email": {
    header: "Xác thực email",
    description: "Kiểm tra hộp thư và xác nhận địa chỉ của bạn.",
  },
};

export function withAuthLayout(pageName: keyof typeof authLayoutProps) {
  return (page: ReactNode) => (
    <GuestLayout {...authLayoutProps[pageName]}>{page}</GuestLayout>
  );
}
