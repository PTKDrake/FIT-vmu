import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

test("CMS layouts page requires a confirmation dialog before delete", async () => {
    const source = await readFile("web/pages/cms/layouts/index.tsx", "utf8");

    assert.match(source, /const \[deleteTarget, setDeleteTarget\] = useState/);
    assert.match(source, /aria-label="Xác nhận xóa layout"/);
    assert.match(source, /role="alertdialog"/);
    assert.match(source, /onAction=\{\(\) => setDeleteTarget\(layout\)\}/);
    assert.doesNotMatch(source, /onAction=\{\(\) =>\s*router\.delete\(/);
});
