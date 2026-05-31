import assert from "node:assert/strict";
import test from "node:test";
import { shouldInterceptUnsavedAnchorNavigation } from "../hooks/unsaved-navigation.ts";

const currentUrl = "https://fit.test/cms/posts/12/edit";

test("intercepts same-origin self navigation for unsaved changes", () => {
    assert.equal(
        shouldInterceptUnsavedAnchorNavigation({
            altKey: false,
            button: 0,
            ctrlKey: false,
            currentUrl,
            defaultPrevented: false,
            download: false,
            href: "https://fit.test/cms/posts",
            metaKey: false,
            shiftKey: false,
            target: null,
        }),
        true,
    );
});

test("does not intercept modified clicks or non-left clicks", () => {
    assert.equal(
        shouldInterceptUnsavedAnchorNavigation({
            altKey: false,
            button: 1,
            ctrlKey: false,
            currentUrl,
            defaultPrevented: false,
            download: false,
            href: "https://fit.test/cms/posts",
            metaKey: false,
            shiftKey: false,
            target: null,
        }),
        false,
    );

    assert.equal(
        shouldInterceptUnsavedAnchorNavigation({
            altKey: false,
            button: 0,
            ctrlKey: true,
            currentUrl,
            defaultPrevented: false,
            download: false,
            href: "https://fit.test/cms/posts",
            metaKey: false,
            shiftKey: false,
            target: null,
        }),
        false,
    );
});

test("does not intercept external, download, or target blank links", () => {
    assert.equal(
        shouldInterceptUnsavedAnchorNavigation({
            altKey: false,
            button: 0,
            ctrlKey: false,
            currentUrl,
            defaultPrevented: false,
            download: false,
            href: "https://example.com/posts",
            metaKey: false,
            shiftKey: false,
            target: null,
        }),
        false,
    );

    assert.equal(
        shouldInterceptUnsavedAnchorNavigation({
            altKey: false,
            button: 0,
            ctrlKey: false,
            currentUrl,
            defaultPrevented: false,
            download: true,
            href: "https://fit.test/storage/report.pdf",
            metaKey: false,
            shiftKey: false,
            target: null,
        }),
        false,
    );

    assert.equal(
        shouldInterceptUnsavedAnchorNavigation({
            altKey: false,
            button: 0,
            ctrlKey: false,
            currentUrl,
            defaultPrevented: false,
            download: false,
            href: "https://fit.test/cms/posts",
            metaKey: false,
            shiftKey: false,
            target: "_blank",
        }),
        false,
    );
});

test("does not intercept hash-only navigation on the current page", () => {
    assert.equal(
        shouldInterceptUnsavedAnchorNavigation({
            altKey: false,
            button: 0,
            ctrlKey: false,
            currentUrl,
            defaultPrevented: false,
            download: false,
            href: "https://fit.test/cms/posts/12/edit#content",
            metaKey: false,
            shiftKey: false,
            target: null,
        }),
        false,
    );
});
