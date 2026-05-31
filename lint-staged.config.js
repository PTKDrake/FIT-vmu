export default {
  "*.{ts,tsx,js,jsx}": () => "react-doctor -y --fail-on error",
  "*.php": () => "./composerw analyse",
}
