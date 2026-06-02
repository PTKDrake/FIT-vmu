import path from "node:path"

const quoteShellArgument = (value) => `'${value.replaceAll("'", `'\"'\"'`)}'`

const toRelativePaths = (files) => files.map((file) => path.relative(process.cwd(), file))

const buildPhpTasks = (files) => {
  const relativeFiles = toRelativePaths(files)
  const quotedFiles = relativeFiles.map(quoteShellArgument).join(" ")
  const stagedTestFiles = relativeFiles.filter((file) => file.startsWith("tests/"))
  const quotedTestFiles = stagedTestFiles.map(quoteShellArgument).join(" ")

  return [
    `./composerw --quiet format:test -- ${quotedFiles}`,
    `./composerw --quiet analyse -- ${quotedFiles}`,
    "./composerw --quiet test",
  ]
}

export default {
  "*.{ts,tsx,js,jsx}": () => "react-doctor -y --staged --fail-on error",
  "*.php": buildPhpTasks,
}
