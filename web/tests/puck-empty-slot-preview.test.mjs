import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

test("Puck layout primitives render empty slot previews in editor mode", async () => {
  const flexSource = await readFile("web/lib/puck/blocks/flex.tsx", "utf8");
  const gridSource = await readFile("web/lib/puck/blocks/grid.tsx", "utf8");
  const layoutsSource = await readFile("web/lib/puck/blocks/layouts.tsx", "utf8");

  assert.match(flexSource, /isPuckEditorPreview\(\)/);
  assert.match(flexSource, /empty:min-h-20/);
  assert.match(flexSource, /empty:min-w-20/);
  assert.match(flexSource, /minEmptyHeight=\{96\}/);
  assert.doesNotMatch(flexSource, /if \(!Children\)/);

  assert.match(gridSource, /isPuckEditorPreview\(\)/);
  assert.match(gridSource, /empty:min-h-20/);
  assert.match(gridSource, /empty:min-w-20/);
  assert.match(gridSource, /minEmptyHeight=\{96\}/);
  assert.doesNotMatch(gridSource, /if \(!Children\)/);

  assert.match(layoutsSource, /empty:min-h-20/);
  assert.match(layoutsSource, /empty:min-w-20/);
  assert.match(layoutsSource, /minEmptyHeight=\{96\}/);
  assert.doesNotMatch(layoutsSource, /if \(!Children && !isPuckEditorPreview\(\)\)/);
});
