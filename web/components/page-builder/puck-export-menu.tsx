import {
  ArrowDownTrayIcon,
  ClipboardDocumentIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@/components/ui/menu";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { useClipboard } from "@/hooks/use-clipboard";
import { serializePuckPageData } from "@/lib/puck/page-builder-data";
import type { VmuFitPageBuilderData } from "@/lib/puck/page-builder-data";

interface PuckExportMenuProps {
  exportName: string;
  getData: () => VmuFitPageBuilderData;
}

export function PuckExportMenu({
  exportName,
  getData,
}: PuckExportMenuProps) {
  const { copy } = useClipboard();

  async function handleCopy(): Promise<void> {
    const json = serializePuckPageData(getData());
    const didCopy = await copy(json);

    if (didCopy) {
      toast.success("Đã sao chép JSON builder vào clipboard.");

      return;
    }

    toast.error("Không thể sao chép JSON builder vào clipboard.");
  }

  function handleDownload(): void {
    const json = serializePuckPageData(getData());
    const blob = new Blob([json], {
      type: "application/json;charset=utf-8",
    });
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = objectUrl;
    link.download = createPuckExportFileName(exportName);
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(objectUrl);

    toast.success("Đã bắt đầu tải file JSON.");
  }

  return (
    <Tooltip delay={0}>
      <Menu>
        <MenuTrigger
          aria-label="Xuất JSON"
          className="inline-flex size-8 items-center justify-center rounded-full border border-border transition hover:bg-muted/40"
        >
          <ArrowDownTrayIcon className="size-4 shrink-0" />
        </MenuTrigger>
        <MenuContent placement="bottom end" popover={{ className: "min-w-52" }}>
          <MenuItem onAction={handleDownload}>
            <ArrowDownTrayIcon />
            Tải file JSON
          </MenuItem>
          <MenuItem onAction={() => void handleCopy()}>
            <ClipboardDocumentIcon />
            Sao chép clipboard
          </MenuItem>
        </MenuContent>
      </Menu>
      <TooltipContent>Xuất JSON builder</TooltipContent>
    </Tooltip>
  );
}

function createPuckExportFileName(exportName: string): string {
  const normalizedName = exportName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${normalizedName || "puck-builder"}.puck.json`;
}
