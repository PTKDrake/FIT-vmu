import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const appSource = readFileSync(new URL("../app.tsx", import.meta.url), "utf8");
const authLayoutSource = readFileSync(
    new URL("../layouts/auth-layout.tsx", import.meta.url),
    "utf8",
);

const authPages = [
    ["login", "LoginPage", "auth/login"],
    ["register", "RegisterPage", "auth/register"],
    ["forgot-password", "ForgotPasswordPage", "auth/forgot-password"],
    ["reset-password", "ResetPasswordPage", "auth/reset-password"],
    ["confirm-password", "ConfirmPasswordPage", "auth/confirm-password"],
    ["verify-email", "VerifyEmailPage", "auth/verify-email"],
];

test("auth pages carry the guest layout during client-side Inertia visits", () => {
    assert.match(
        appSource,
        /import \{ authLayoutProps \} from "@\/layouts\/auth-layout"/,
    );
    assert.match(authLayoutSource, /export function withAuthLayout/);
    assert.match(
        authLayoutSource,
        /<GuestLayout \{\.\.\.authLayoutProps\[pageName\]\}>/,
    );

    for (const [fileName, componentName, pageName] of authPages) {
        const source = readFileSync(
            new URL(`../pages/auth/${fileName}.tsx`, import.meta.url),
            "utf8",
        );

        assert.match(
            source,
            /import \{ withAuthLayout \} from "@\/layouts\/auth-layout"/,
        );
        assert.match(
            source,
            new RegExp(
                `${componentName}\\.layout = withAuthLayout\\("${pageName}"\\)`,
            ),
        );
    }
});
