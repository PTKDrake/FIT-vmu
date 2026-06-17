import { uploadCmsMediaFile } from "@/components/cms/media-selector";

export async function uploadBlockNoteCmsMedia(file: File): Promise<string> {
  const media = await uploadCmsMediaFile(file);

  return media.previewUrl;
}
