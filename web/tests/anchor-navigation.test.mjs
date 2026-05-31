import assert from "node:assert/strict";
import test from "node:test";
import { shouldInterceptInternalAnchorNavigation } from "../lib/navigation/anchor-navigation.ts";

const currentUrl = "https://fit.test/cms/posts/12/edit";

test("intercepts same-origin internal anchor navigation", () => {
    assert.equal(
        shouldInterceptInternalAnchorNavigation({
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

test("does not intercept modified clicks, downloads, or external links", () => {
    assert.equal(
        shouldInterceptInternalAnchorNavigation({
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

    assert.equal(
        shouldInterceptInternalAnchorNavigation({
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
        shouldInterceptInternalAnchorNavigation({
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
});

test("does not intercept hash-only navigation on the same page", () => {
    assert.equal(
        shouldInterceptInternalAnchorNavigation({
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
