import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const rootTemplateSource = readFileSync(
    new URL("../../resources/views/app.blade.php", import.meta.url),
    "utf8",
);

test("Inertia root template loads public and app styles for SPA navigation", () => {
    assert.doesNotMatch(
        rootTemplateSource,
        /str_starts_with\(\$page\['component'\]/,
    );
    assert.match(rootTemplateSource, /'resources\/css\/public\.css'/);
    assert.match(rootTemplateSource, /'resources\/css\/app\.css'/);
    assert.match(rootTemplateSource, /'web\/app\.tsx'/);
});
