import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const siteLayoutFormSource = readFileSync(
    new URL(
        "../components/layout-builder/site-layout-form.tsx",
        import.meta.url,
    ),
    "utf8",
);
const cmsTopbarSource = readFileSync(
    new URL("../components/cms/layout/cms-topbar.tsx", import.meta.url),
    "utf8",
);

test("site layout editor keeps the Puck builder outside the metadata form", () => {
    assert.match(
        siteLayoutFormSource,
        /<div className="flex flex-1 flex-col gap-4 p-4 pt-0">[\s\S]*<form onSubmit=\{\(event\) => \{[\s\S]*<Fieldset[\s\S]*<\/Fieldset>[\s\S]*<\/form>[\s\S]*<PuckLayoutBuilder/s,
    );
});

test("cms topbar breadcrumbs always provide a non-empty href for the current page crumb", () => {
    assert.match(
        cmsTopbarSource,
        /const normalizedUrl = currentUrl\.split\("\?"\)\[0\];/,
    );
    assert.match(
        cmsTopbarSource,
        /<Breadcrumbs\.Item href=\{normalizedUrl\}>\{subpageTitle\}<\/Breadcrumbs\.Item>/,
    );
});
