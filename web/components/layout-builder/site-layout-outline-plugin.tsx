import type { Plugin } from "@puckeditor/core";
import { createUsePuck } from "@puckeditor/core";
import { twMerge } from "tailwind-merge";
import type { PageBuilderConfig } from "@/lib/puck/blocks/types";
import type { VmuFitPageBuilderData } from "@/lib/puck/page-builder-data";
import type { VmuFitPageBuilderComponents } from "@/lib/puck/page-builder-data";

const useSiteLayoutOutlinePuck = createUsePuck<PageBuilderConfig>();
const emptyOutlineData: VmuFitPageBuilderData = {
  root: {
    props: {},
  },
  content: [],
  zones: {},
};

const orderedRootSlots = [
  { key: "header", label: "Header" },
  { key: "left", label: "Left sidebar" },
  { key: "right", label: "Right sidebar" },
  { key: "footer", label: "Footer" },
] as const;

interface OutlineBlockNode {
  children: OutlineSlotNode[];
  id: string;
  index: number;
  label: string;
  type: keyof VmuFitPageBuilderComponents;
  zone: string;
}

interface OutlineSlotNode {
  items: OutlineBlockNode[];
  key: string;
  label: string;
  zone: string;
}

interface OutlineBlockData {
  props?: Record<string, unknown>;
  type: keyof VmuFitPageBuilderComponents;
}

interface OutlineSiteLayoutFrameBlockData extends OutlineBlockData {
  props?: Record<(typeof orderedRootSlots)[number]["key"], unknown> &
    Record<string, unknown>;
  type: "SiteLayoutFrame";
}

export function createSiteLayoutOutlinePlugin(): Plugin<PageBuilderConfig> {
  return {
    name: "outline",
    label: "Outline",
    render: () => <SiteLayoutOutlinePanel />,
  };
}

function SiteLayoutOutlinePanel() {
  const data = useSiteLayoutOutlinePuck(
    (state) => state.appState?.data ?? emptyOutlineData,
  );
  const config = useSiteLayoutOutlinePuck((state) => state.config);
  const dispatch = useSiteLayoutOutlinePuck((state) => state.dispatch);
  const selectedItemId = useSiteLayoutOutlinePuck((state) => {
    const selectedItem = state.selectedItem;

    if (!selectedItem || !selectedItem.props) {
      return null;
    }

    return typeof selectedItem.props.id === "string"
      ? selectedItem.props.id
      : null;
  });

  const frame = data.content.find(
    (item: unknown) =>
      isOutlineBlockData(item) && item.type === "SiteLayoutFrame",
  ) as OutlineSiteLayoutFrameBlockData | undefined;

  const frameId = readBlockId(frame);

  if (!frame || !frameId) {
    return (
      <div className="px-3 py-4 text-sm text-muted-fg">
        Chưa có khung SiteLayout để hiển thị outline.
      </div>
    );
  }

  const rootSlots = orderedRootSlots.map(({ key, label }) =>
    buildOutlineSlotNode({
      config,
      items: readSlotItems(frame.props?.[key]),
      label,
      slotKey: key,
      zone: `${frameId}:${key}`,
    }),
  );

  return (
    <div className="space-y-4 px-3 py-3">
      {rootSlots.map((slot) => (
        <div key={slot.zone} className="space-y-2">
          <div className="border-b border-border/70 pb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-fg">
            {slot.label}
          </div>

          {slot.items.length > 0 ? (
            <OutlineNodeList
              nodes={slot.items}
              selectedItemId={selectedItemId}
              onSelect={(zone, index) => {
                dispatch({
                  type: "setUi",
                  ui: {
                    itemSelector: {
                      zone,
                      index,
                    },
                  },
                });
              }}
            />
          ) : (
            <div className="rounded-lg border border-dashed border-border/70 px-3 py-2 text-xs text-muted-fg">
              Chưa có block trong vùng này.
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function OutlineNodeList({
  nodes,
  onSelect,
  selectedItemId,
}: {
  nodes: OutlineBlockNode[];
  onSelect: (zone: string, index: number) => void;
  selectedItemId: string | null;
}) {
  return (
    <ul className="space-y-1.5">
      {nodes.map((node) => (
        <li key={node.id} className="space-y-1.5">
          <button
            type="button"
            className={twMerge(
              "flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition",
              selectedItemId === node.id
                ? "border-primary/40 bg-primary/10 text-fg"
                : "border-border/70 bg-overlay text-fg hover:bg-muted/60",
            )}
            onClick={() => onSelect(node.zone, node.index)}
          >
            <span className="truncate font-medium">{node.label}</span>
          </button>

          {node.children.length > 0 ? (
            <div className="space-y-2 pl-3">
              {node.children.map((slot) => (
                <div key={slot.zone} className="space-y-1.5">
                  <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-fg">
                    {slot.label}
                  </div>

                  {slot.items.length > 0 ? (
                    <OutlineNodeList
                      nodes={slot.items}
                      onSelect={onSelect}
                      selectedItemId={selectedItemId}
                    />
                  ) : (
                    <div className="rounded-md border border-dashed border-border/60 px-2.5 py-1.5 text-xs text-muted-fg">
                      Trống
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function buildOutlineSlotNode({
  config,
  items,
  label,
  slotKey,
  zone,
}: {
  config: PageBuilderConfig;
  items: OutlineBlockData[];
  label: string;
  slotKey: string;
  zone: string;
}): OutlineSlotNode {
  return {
    key: slotKey,
    label,
    zone,
    items: items
      .map((item, index) =>
        buildOutlineBlockNode({
          config,
          index,
          item,
          zone,
        }),
      )
      .filter((item): item is OutlineBlockNode => item !== null),
  };
}

function buildOutlineBlockNode({
  config,
  index,
  item,
  zone,
}: {
  config: PageBuilderConfig;
  index: number;
  item: OutlineBlockData;
  zone: string;
}): OutlineBlockNode | null {
  const componentConfig = config.components[item.type];
  const id = readBlockId(item);

  if (!componentConfig || !id) {
    return null;
  }

  const slotEntries = Object.entries(componentConfig.fields ?? {}).filter(
    ([, field]) => field.type === "slot",
  );

  return {
    id,
    index,
    label: componentConfig.label ?? item.type,
    type: item.type,
    zone,
    children: slotEntries.map(([slotKey, field]) =>
      buildOutlineSlotNode({
        config,
        items: readSlotItems(item.props?.[slotKey]),
        label: field.label ?? slotKey,
        slotKey,
        zone: `${id}:${slotKey}`,
      }),
    ),
  };
}

function readSlotItems(value: unknown): OutlineBlockData[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isOutlineBlockData);
}

function isOutlineBlockData(item: unknown): item is OutlineBlockData {
  if (item === null || typeof item !== "object" || !("type" in item)) {
    return false;
  }

  return typeof item.type === "string";
}

function readBlockId(
  item: { props?: Record<string, unknown> } | undefined,
): string | null {
  const blockId = item?.props?.id;

  return typeof blockId === "string" && blockId !== "" ? blockId : null;
}
