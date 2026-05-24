import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { writeFile, rm } from 'node:fs/promises'
import { resolve } from 'node:path'
import test from 'node:test'

const projectRoot = process.cwd()
const fixturePath = resolve(projectRoot, 'web/oxlint-effect-check.tsx')

const runOxlint = (files) =>
    new Promise((resolveRun) => {
        const child = spawn('pnpm', ['exec', 'oxlint', '--config', '.oxlintrc.json', ...files], {
            cwd: projectRoot,
            shell: false,
        })

        let output = ''

        child.stdout.on('data', (chunk) => {
            output += chunk.toString()
        })

        child.stderr.on('data', (chunk) => {
            output += chunk.toString()
        })

        child.on('close', (status) => {
            resolveRun({ status, output })
        })
    })

test('useEffect is only allowed inside the mount-effect hook', async () => {
    await writeFile(
        fixturePath,
        [
            "import { useEffect } from 'react'",
            "import * as React from 'react'",
            '',
            'export function Example() {',
            '    useEffect(() => {}, [])',
            '    React.useEffect(() => {}, [])',
            '    return null',
            '}',
            '',
        ].join('\n'),
    )

    try {
        const allowedResult = await runOxlint(['web/hooks/use-mount-effect.ts'])
        const blockedResult = await runOxlint(['web/oxlint-effect-check.tsx'])

        assert.equal(allowedResult.status, 0)
        assert.equal(blockedResult.status, 1)
        assert.equal((blockedResult.output.match(/eslint-js\(no-restricted-syntax\)/g) ?? []).length, 2)
        assert.match(blockedResult.output, /skills\/no-use-effect\/SKILL\.md/)
        assert.match(blockedResult.output, /skills\/no-use-effect\/references\/patterns\.md/)
    } finally {
        await rm(fixturePath, { force: true })
    }
})
