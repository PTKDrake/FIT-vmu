import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

test("Puck blocks map props.id to public render DOM ids", async () => {
  const contentSource = await readFile("web/lib/puck/blocks/content.tsx", "utf8");
  const sectionsSource = await readFile("web/lib/puck/blocks/sections.tsx", "utf8");
  const layoutFrameSource = await readFile("web/lib/puck/blocks/site-layout-frame.tsx", "utf8");
  const authStatusSource = await readFile("web/lib/puck/blocks/auth-status.tsx", "utf8");

  assert.match(contentSource, /const id = getPuckBlockDomId\(props\.id\)/);
  assert.match(contentSource, /<figure\s+id=\{id\}/s);
  assert.match(contentSource, /<CardUI\s+id=\{id\}/s);

  assert.match(sectionsSource, /const id = getPuckBlockDomId\(props\.id\)/);
  assert.match(sectionsSource, /<section\s+id=\{id\}/s);
  assert.match(sectionsSource, /<div id=\{id\}>/);

  assert.match(layoutFrameSource, /const domId = getPuckBlockDomId\(id\)/);
  assert.match(layoutFrameSource, /<div id=\{domId\} className=\{frameClassName\}>/);

  assert.match(authStatusSource, /const domId = getPuckBlockDomId\(id\)/);
  assert.match(authStatusSource, /id=\{domId\}/);
});
