export default {
  "*.{ts,tsx,js,jsx}": () => "pnpm exec react-doctor -y --staged --fail-on error",
  "*.php": [
    () => "composer --quiet format:test",
    () => "composer --quiet analyse",
    () => "composer --quiet test",
  ],
};
