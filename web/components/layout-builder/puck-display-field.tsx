import {
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  DeviceTabletIcon,
} from "@heroicons/react/24/outline";
import { createUsePuck } from "@puckeditor/core";
import type { ComponentType, ReactNode } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  puckDisplayDevices,
  type PuckDisplayDevice,
} from "@/lib/puck/blocks/shared";

interface PuckLabelProps {
  children: ReactNode;
  icon?: ReactNode;
  label: string;
  readOnly?: boolean;
}

interface PuckDisplayFieldProps {
  Label?: ComponentType<PuckLabelProps>;
  field: {
    label?: string;
  };
  label?: string;
  labelIcon?: ReactNode;
  name: string;
  onChange: (value: PuckDisplayDevice[]) => void;
  readOnly?: boolean;
  value?: unknown;
}

const usePuck = createUsePuck();

const displayDeviceOptions: Array<{
  ariaLabel: string;
  icon: typeof DevicePhoneMobileIcon;
  value: PuckDisplayDevice;
}> = [
  {
    ariaLabel: "Hiển thị trên điện thoại",
    icon: DevicePhoneMobileIcon,
    value: "mobile",
  },
  {
    ariaLabel: "Hiển thị trên máy tính bảng",
    icon: DeviceTabletIcon,
    value: "tablet",
  },
  {
    ariaLabel: "Hiển thị trên máy tính",
    icon: ComputerDesktopIcon,
    value: "desktop",
  },
];

function getDeep(node: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc == null || typeof acc !== "object") {
      return undefined;
    }

    return (acc as Record<string, unknown>)[key];
  }, node);
}

function normalizeDisplayOn(value: unknown): Set<PuckDisplayDevice> {
  if (!Array.isArray(value)) {
    return new Set(puckDisplayDevices);
  }

  const devices = value.filter((item): item is PuckDisplayDevice =>
    puckDisplayDevices.includes(item as PuckDisplayDevice),
  );

  return new Set(devices.length > 0 ? devices : puckDisplayDevices);
}

export function PuckDisplayField({
  Label,
  field,
  label,
  labelIcon,
  name,
  onChange,
  readOnly,
  value: fieldValue,
}: PuckDisplayFieldProps) {
  const puckValue = usePuck((state) => {
    const props = state.selectedItem?.props ?? state.appState.data.root.props;

    return getDeep(props, name);
  });
  const selectedKeys = normalizeDisplayOn(
    fieldValue !== undefined ? fieldValue : puckValue,
  );
  const displayLabel = label ?? field.label ?? name;

  const group = (
    <ToggleGroup
      aria-label={displayLabel}
      isDisabled={readOnly}
      selectedKeys={selectedKeys}
      selectionMode="multiple"
      size="sq-sm"
      onSelectionChange={(keys) => {
        const nextValue = puckDisplayDevices.filter((device) => keys.has(device));

        onChange(nextValue);
      }}
    >
      {displayDeviceOptions.map(({ ariaLabel, icon: Icon, value }) => (
        <ToggleGroupItem key={value} aria-label={ariaLabel} id={value}>
          <Icon />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );

  if (Label) {
    return (
      <Label icon={labelIcon} label={displayLabel} readOnly={readOnly}>
        {group}
      </Label>
    );
  }

  return group;
}
