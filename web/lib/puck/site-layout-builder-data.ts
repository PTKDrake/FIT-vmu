import {
  clonePuckPageData,
  createEmptyPuckData,
  parsePuckLayoutData,
  serializePuckPageData,
} from "./page-builder-data";
import type {
  VmuFitPageBuilderData,
  VmuFitPageBuilderValue,
} from "./page-builder-data";

const SITE_LAYOUT_FRAME_ID = "site-layout-frame";

interface SiteLayoutSlotValues {
  footerData?: VmuFitPageBuilderValue;
  headerData?: VmuFitPageBuilderValue;
  leftData?: VmuFitPageBuilderValue;
  rightData?: VmuFitPageBuilderValue;
}

interface SiteLayoutSplitValues {
  footer_data: string;
  header_data: string;
  left_data: string;
  right_data: string;
}

type PuckContent = VmuFitPageBuilderData["content"];

interface SiteLayoutFrameProps {
  footer?: unknown;
  header?: unknown;
  left?: unknown;
  right?: unknown;
}

export function createCombinedSiteLayoutData({
  footerData,
  headerData,
  leftData,
  rightData,
}: SiteLayoutSlotValues): VmuFitPageBuilderData {
  return sanitizeCombinedSiteLayoutData({
    root: {
      props: {},
    },
    content: [
      {
        type: "SiteLayoutFrame",
        props: {
          id: SITE_LAYOUT_FRAME_ID,
          header: parsePuckLayoutData(headerData).content,
          left: parsePuckLayoutData(leftData).content,
          right: parsePuckLayoutData(rightData).content,
          footer: parsePuckLayoutData(footerData).content,
        },
      },
    ],
  });
}

export function splitCombinedSiteLayoutData(
  data: VmuFitPageBuilderData,
): SiteLayoutSplitValues {
  const sanitizedData = sanitizeCombinedSiteLayoutData(data);

  const frame = sanitizedData.content.find((item) => item.type === "SiteLayoutFrame") as
    | { props?: SiteLayoutFrameProps }
    | undefined;

  return {
    header_data: serializeSlotData(frame?.props?.header),
    left_data: serializeSlotData(frame?.props?.left),
    right_data: serializeSlotData(frame?.props?.right),
    footer_data: serializeSlotData(frame?.props?.footer),
  };
}

export function sanitizeCombinedSiteLayoutData(
  data: VmuFitPageBuilderData,
): VmuFitPageBuilderData {
  const frame = data.content.find((item) => item.type === "SiteLayoutFrame");

  if (!frame) {
    return createCombinedSiteLayoutData({});
  }

  return {
    ...clonePuckPageData(data),
    content: [
      {
        ...frame,
        props: {
          ...frame.props,
          id:
            typeof frame.props?.id === "string" && frame.props.id !== ""
              ? frame.props.id
              : SITE_LAYOUT_FRAME_ID,
        },
      },
    ],
  };
}

function serializeSlotData(content: unknown): string {
  return serializePuckPageData({
    ...createEmptyPuckData(),
    content: cloneSlotContent(content),
  });
}

function cloneSlotContent(content: unknown): PuckContent {
  if (!Array.isArray(content)) {
    return [];
  }

  return clonePuckPageData({
    root: {
      props: {},
    },
    content: content as PuckContent,
  }).content;
}
