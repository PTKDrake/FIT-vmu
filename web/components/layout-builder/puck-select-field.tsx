import { createUsePuck } from "@puckeditor/core";
import { useState } from "react";
import type { ComponentType, ReactNode } from "react";
import { ListBox } from "react-aria-components/ListBox";
import { PopoverContent } from "@/components/ui/popover";
import {
  Select,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import { cx } from "@/lib/primitive";
import { includesNormalizedSearch } from "@/lib/search";

interface FieldOption {
  label: string;
  value: string | number | boolean | undefined | null | object;
}

interface PuckLabelProps {
  children: ReactNode;
  icon?: ReactNode;
  label: string;
  readOnly?: boolean;
}

interface PuckSelectFieldProps {
  Label?: ComponentType<PuckLabelProps>;
  children: ReactNode;
  field: {
    label?: string;
    options: FieldOption[] | ReadonlyArray<FieldOption>;
  };
  id?: string;
  label?: string;
  labelIcon?: ReactNode;
  name: string;
  onChange: (value: FieldOption["value"]) => void;
  readOnly?: boolean;
  value: FieldOption["value"];
}

const SEARCH_THRESHOLD = 5;

const usePuck = createUsePuck();

function toOptionKey(value: FieldOption["value"]): string {
  return JSON.stringify({ value });
}

function getDeep(node: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc == null || typeof acc !== "object") {
      return undefined;
    }

    return (acc as Record<string, unknown>)[key];
  }, node);
}

export function PuckSelectField({
  Label,
  field,
  label,
  labelIcon,
  name,
  onChange,
  readOnly,
  value: fieldValue,
}: PuckSelectFieldProps) {
  const puckValue = usePuck((state) => {
    const props = state.selectedItem?.props ?? state.appState.data.root.props;

    return getDeep(props, name) as FieldOption["value"];
  });
  const value = fieldValue !== undefined ? fieldValue : puckValue;
  const options = field.options as FieldOption[];
  const isSearchable = options.length > SEARCH_THRESHOLD;
  const [search, setSearch] = useState("");

  const filteredOptions =
    isSearchable && search !== ""
      ? options.filter((opt) =>
          includesNormalizedSearch(opt.label, search),
        )
      : options;

  function handleSelect(key: string | number | null): void {
    if (key === null) {
      return;
    }

    try {
      const parsed = JSON.parse(String(key)) as { value: FieldOption["value"] };

      onChange(parsed.value);
    } catch {
      // ignore malformed keys
    }
  }

  function renderItems(): ReactNode {
    return filteredOptions.map((opt) => {
      const key = toOptionKey(opt.value);

      return (
        <SelectItem key={key} id={key} textValue={opt.label}>
          <SelectLabel>{opt.label}</SelectLabel>
        </SelectItem>
      );
    });
  }

  const selectedKey = toOptionKey(value);
  const displayLabel = label ?? field.label ?? name;

  const selectElement = (
    <Select
      aria-label={displayLabel}
      isDisabled={readOnly}
      onChange={handleSelect}
      value={selectedKey}
    >
      <SelectTrigger />
      {isSearchable ? (
        <PopoverContent
          className="min-w-(--trigger-width) overflow-hidden *:data-[slot=popover-inner]:overflow-hidden"
          placement="bottom"
        >
          <div className="border-b border-border/50 p-2">
            <input
              autoFocus
              className="w-full rounded-md border border-input bg-transparent px-2.5 py-1.5 text-sm outline-hidden placeholder:text-muted-fg focus:border-ring/70 focus:ring-2 focus:ring-ring/20"
              onChange={(event) => setSearch(event.target.value)}
              onClick={(event) => event.stopPropagation()}
              onKeyDown={(event) => event.stopPropagation()}
              placeholder="Tìm kiếm..."
              type="text"
              value={search}
            />
          </div>
          <ListBox
            className={cx(
              "grid max-h-64 w-full grid-cols-[auto_1fr] flex-col gap-y-1 overflow-y-auto p-1 outline-hidden",
              "scrollbar scrollbar-track-transparent scrollbar-thumb-border",
            )}
            layout="stack"
            orientation="vertical"
          >
            {renderItems()}
          </ListBox>
        </PopoverContent>
      ) : (
        <PopoverContent
          className="min-w-(--trigger-width) overflow-hidden *:data-[slot=popover-inner]:overflow-hidden"
          placement="bottom"
        >
          <ListBox
            className="grid max-h-[inherit] w-full grid-cols-[auto_1fr] flex-col gap-y-1 overflow-y-auto p-1 outline-hidden"
            layout="stack"
            orientation="vertical"
          >
            {renderItems()}
          </ListBox>
        </PopoverContent>
      )}
    </Select>
  );

  if (Label) {
    return (
      <Label icon={labelIcon} label={displayLabel} readOnly={readOnly}>
        {selectElement}
      </Label>
    );
  }

  return selectElement;
}
