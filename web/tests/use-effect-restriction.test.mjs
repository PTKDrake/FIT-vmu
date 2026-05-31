import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { ESLint } from "eslint";
import { writeFile, rm } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";

const projectRoot = resolve(import.meta.dirname, "..", "..");
const fixturePath = resolve(projectRoot, "web/oxlint-effect-check.tsx");

const runOxlint = (files) =>
    new Promise((resolveRun) => {
        const child = spawn(
            "pnpm",
            ["exec", "oxlint", "--config", ".oxlintrc.json", ...files],
            {
                cwd: projectRoot,
                shell: false,
            },
        );

        let output = "";

        child.stdout.on("data", (chunk) => {
            output += chunk.toString();
        });

        child.stderr.on("data", (chunk) => {
            output += chunk.toString();
        });

        child.on("close", (status) => {
            resolveRun({ status, output });
        });
    });

const eslint = new ESLint({ cwd: projectRoot });

const runEslint = async (files) => {
    const results = await eslint.lintFiles(files);
    const errorCount = results.reduce(
        (total, result) => total + result.errorCount,
        0,
    );

    return { status: errorCount > 0 ? 1 : 0, results };
};

test("useEffect is only allowed inside the mount-effect hook", async () => {
    await writeFile(
        fixturePath,
        [
            "import { useEffect } from 'react'",
            "import * as React from 'react'",
            "",
            "export function Example() {",
            "    useEffect(() => {}, [])",
            "    React.useEffect(() => {}, [])",
            "    return null",
            "}",
            "",
        ].join("\n"),
    );

    try {
        const allowedResult = await runOxlint([
            "web/hooks/use-mount-effect.ts",
        ]);
        const blockedResult = await runOxlint(["web/oxlint-effect-check.tsx"]);
        const eslintAllowedResult = await runEslint([
            "web/hooks/use-mount-effect.ts",
        ]);
        const eslintBlockedResult = await runEslint([
            "web/oxlint-effect-check.tsx",
        ]);
        const eslintBlockedMessages = eslintBlockedResult.results
            .flatMap((entry) => entry.messages)
            .filter((message) => message.ruleId === "no-restricted-syntax");

        assert.equal(allowedResult.status, 0);
        assert.equal(blockedResult.status, 1);
        assert.equal(eslintAllowedResult.status, 0);
        assert.equal(eslintBlockedResult.status, 1);
        assert.equal(
            (
                blockedResult.output.match(
                    /eslint-js\(no-restricted-syntax\)/g,
                ) ?? []
            ).length,
            2,
        );
        assert.equal(eslintBlockedMessages.length, 2);
        assert.match(blockedResult.output, /skills\/no-use-effect\/SKILL\.md/);
        assert.match(
            blockedResult.output,
            /skills\/no-use-effect\/references\/patterns\.md/,
        );
        assert.ok(
            eslintBlockedMessages.every((message) =>
                message.message.includes("skills/no-use-effect/SKILL.md"),
            ),
        );
        assert.ok(
            eslintBlockedMessages.every((message) =>
                message.message.includes(
                    "skills/no-use-effect/references/patterns.md",
                ),
            ),
        );
    } finally {
        await rm(fixturePath, { force: true });
    }
});
