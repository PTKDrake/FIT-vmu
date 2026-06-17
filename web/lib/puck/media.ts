export interface PuckMediaReference {
  mediaId: number;
  displayName?: string | null;
  mimeType?: string | null;
  previewUrl?: string | null;
}

export type PuckImageValue = string | PuckMediaReference | null | undefined;

interface PuckDynamicMediaItem {
  displayName: string;
  id: number;
  mimeType: string;
  previewUrl: string;
}

export function createPuckMediaReference(media: {
  displayName: string;
  id: number;
  mimeType: string;
  previewUrl: string;
}): PuckMediaReference {
  return {
    mediaId: media.id,
    displayName: media.displayName,
    mimeType: media.mimeType,
    previewUrl: media.previewUrl,
  };
}

export function getPuckImageUrl(value: PuckImageValue): string {
  if (typeof value === "string") {
    return value;
  }

  if (!value || typeof value !== "object") {
    return "";
  }

  if (value.previewUrl) {
    return value.previewUrl;
  }

  const mapped = readPuckMediaMap()[value.mediaId];

  return mapped?.previewUrl ?? "";
}

export function getPuckMediaDisplayName(value: PuckImageValue): string | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  return (
    value.displayName ??
    readPuckMediaMap()[value.mediaId]?.displayName ??
    null
  );
}

export function getPuckMediaId(value: PuckImageValue): number | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  return Number.isInteger(value.mediaId) ? value.mediaId : null;
}

function readPuckMediaMap(): Record<number, PuckDynamicMediaItem> {
  if (typeof window === "undefined") {
    return {};
  }

  const currentWindow = window as Window & {
    __VMU_PUCK_DYNAMIC_DATA__?: {
      media?: Record<number, PuckDynamicMediaItem>;
    };
  };

  if (currentWindow.__VMU_PUCK_DYNAMIC_DATA__?.media) {
    return currentWindow.__VMU_PUCK_DYNAMIC_DATA__.media;
  }

  try {
    const topWindow = window.top as Window & {
      __VMU_PUCK_DYNAMIC_DATA__?: {
        media?: Record<number, PuckDynamicMediaItem>;
      };
    } | null;

    return topWindow?.__VMU_PUCK_DYNAMIC_DATA__?.media ?? {};
  } catch {
    return {};
  }
}
