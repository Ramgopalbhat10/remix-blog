/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  cacheDirectory: "./node_modules/.cache/remix",
  ignoredRouteFiles: ["**/.*", "**/*.css", "**/*.test.{js,jsx,ts,tsx}"],
  serverDependenciesToBundle: [
    // "@code-hike/mdx",
    // "unified",
    // "bail",
    // "trough",
    // "zwitch",
    // /^estree-*/,
    // /^vfile*/,
    /^rehype*/,
    /^hast*/,
    /^unist*/,
    "property-information",
    "space-separated-tokens",
    "comma-separated-tokens",
  ],
};
