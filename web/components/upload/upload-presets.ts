import type { Accept } from "react-dropzone";

export interface UploadPreset {
  accept: Accept;
  description: string;
  helperText: string;
  maxFiles: number;
  maxSize: number;
  title: string;
}

export const uploadPresets = {
  avatar: {
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    description: "Ảnh đại diện vuông, ưu tiên nền gọn và dung lượng nhẹ.",
    helperText: "Cho phép JPG, PNG, WEBP. Tối đa 2 MB, 1 tệp.",
    maxFiles: 1,
    maxSize: 2 * 1024 * 1024,
    title: "Avatar",
  },
  document: {
    accept: {
      "application/msword": [".doc"],
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    description: "Tài liệu chuẩn để đính kèm bài viết, trang hoặc hồ sơ nội bộ.",
    helperText: "Cho phép PDF, DOC, DOCX. Tối đa 10 MB, tối đa 3 tệp.",
    maxFiles: 3,
    maxSize: 10 * 1024 * 1024,
    title: "Tài liệu",
  },
  excel: {
    accept: {
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    description: "Dùng cho import dữ liệu hoặc tài liệu cá nhân hóa theo mã sinh viên.",
    helperText: "Cho phép XLS, XLSX. Tối đa 15 MB, tối đa 2 tệp.",
    maxFiles: 2,
    maxSize: 15 * 1024 * 1024,
    title: "Excel",
  },
  thumbnail: {
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    description: "Ảnh thumbnail cho bài viết hoặc trang nội dung trong CMS.",
    helperText: "Cho phép JPG, PNG, WEBP. Tối đa 4 MB, 1 tệp.",
    maxFiles: 1,
    maxSize: 4 * 1024 * 1024,
    title: "Thumbnail",
  },
} satisfies Record<string, UploadPreset>;

