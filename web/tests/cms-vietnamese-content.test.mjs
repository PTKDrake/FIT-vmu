import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const navigationSource = readFileSync(
    new URL("../components/cms/navigation.ts", import.meta.url),
    "utf8",
);
const mediaPageSource = readFileSync(
    new URL("../pages/cms/media/index.tsx", import.meta.url),
    "utf8",
);
const pageCreateSource = readFileSync(
    new URL("../pages/cms/pages/create.tsx", import.meta.url),
    "utf8",
);
const pageShowSource = readFileSync(
    new URL("../pages/cms/pages/show.tsx", import.meta.url),
    "utf8",
);
const navigationShowSource = readFileSync(
    new URL("../pages/cms/navigation/show.tsx", import.meta.url),
    "utf8",
);
const layoutsIndexSource = readFileSync(
    new URL("../pages/cms/layouts/index.tsx", import.meta.url),
    "utf8",
);

test("cms navigation labels are localized to vietnamese", () => {
    assert.match(navigationSource, /Bảng điều khiển/);
    assert.match(navigationSource, /Bố cục/);
    assert.match(navigationSource, /Điều hướng/);
    assert.match(navigationSource, /Thư viện media/);
});

test("cms media page uses vietnamese labels", () => {
    assert.match(mediaPageSource, /Quản lý media/);
    assert.match(mediaPageSource, /Khu vực thả media/);
    assert.match(mediaPageSource, /Kiểu MIME/);
    assert.match(mediaPageSource, /Tệp media này đang được dùng ở/);
});

test("cms page builder and preview screens are localized", () => {
    assert.match(pageCreateSource, /Bố cục trang cơ bản/);
    assert.match(pageCreateSource, /Bố cục trang đích/);
    assert.match(pageCreateSource, /Bố cục đơn vị học thuật/);
    assert.match(pageCreateSource, /Bố cục dạng bài viết/);
    assert.match(pageShowSource, /Xem trước trang:/);
    assert.match(navigationShowSource, /Điều hướng ·/);
});

test("cms layouts overview is localized", () => {
    assert.match(layoutsIndexSource, /Bố cục/);
    assert.match(layoutsIndexSource, /chân trang[\s\S]*công khai/);
    assert.match(layoutsIndexSource, /Chưa có bố cục nào/);
});
