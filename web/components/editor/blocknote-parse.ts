import type { Block } from "@blocknote/core";
import {
  BLOCKNOTE_FORMAT,
  EMPTY_BLOCKNOTE_CONTENT,
  type BlockNoteContent,
  type BlockNoteFormat,
  type BlockNoteInitialContent,
  type BlockNoteValue,
} from "./blocknote-types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isBlockNoteBlock(value: unknown): value is Block {
  return isRecord(value) && typeof value.type === "string";
}

function cloneEmptyContent(): BlockNoteInitialContent {
  return EMPTY_BLOCKNOTE_CONTENT.map((block) => ({ ...block }));
}

export function parseBlockNoteContent(
  value: BlockNoteValue,
): BlockNoteInitialContent {
  if (typeof value === "string") {
    const trimmedValue = value.trim();

    if (trimmedValue.length === 0) {
      return cloneEmptyContent();
    }

    try {
      const parsedValue = JSON.parse(trimmedValue) as unknown;

      return parseBlockNoteContent(parsedValue as BlockNoteInitialContent);
    } catch {
      return cloneEmptyContent();
    }
  }

  if (!Array.isArray(value)) {
    return cloneEmptyContent();
  }

  const parsedBlocks = value.filter(isBlockNoteBlock);

  if (parsedBlocks.length === 0) {
    return cloneEmptyContent();
  }

  return parsedBlocks as BlockNoteInitialContent;
}

export function serializeBlockNoteContent(value: BlockNoteValue): string {
  return JSON.stringify(parseBlockNoteContent(value));
}

export function getBlockNoteFormat(): BlockNoteFormat {
  return BLOCKNOTE_FORMAT;
}

export function isEmptyBlockNoteContent(value: BlockNoteValue): boolean {
  const blocks = parseBlockNoteContent(value);

  if (blocks.length !== 1) {
    return false;
  }

  const [firstBlock] = blocks;

  return firstBlock.type === "paragraph" && firstBlock.content === "";
}

export function cloneBlockNoteContent(
  value: BlockNoteContent,
): BlockNoteContent {
  return structuredClone(value);
}
