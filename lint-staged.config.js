export default {
  "*.{ts,tsx,js,jsx}": () => "pnpm exec react-doctor -y --staged --fail-on error",
  "*.php": [
    () => "./composerw --quiet format:test",
    () => "./composerw --quiet analyse",
    () => "./composerw --quiet test",
  ],
};
