import { bundleMDX } from "mdx-bundler";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { h } from "hastscript";
import path from "path";
import { moonLightTheme } from "~/styles/moonlight-theme";
const { remarkCodeHike } = require("@code-hike/mdx");

if (process.platform === "win32") {
  process.env.ESBUILD_BINARY_PATH = path.join(
    process.cwd(),
    "node_modules",
    "esbuild",
    "esbuild.exe"
  );
} else {
  process.env.ESBUILD_BINARY_PATH = path.join(
    process.cwd(),
    "node_modules",
    "esbuild",
    "bin",
    "esbuild"
  );
}

const directory = path.join(process.cwd(), "/app");

export default async function compileMDX(markdown: string) {
  const result = await bundleMDX({
    source: markdown,
    cwd: directory,
    mdxOptions(options) {
      options.rehypePlugins = [
        ...(options?.rehypePlugins ?? []),
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            properties: {
              className: ["anchor"],
            },
            behavior: "prepend",
            content: [h("span.visually-hidden", "#")],
          },
        ],
      ];
      options.remarkPlugins = [
        ...(options?.remarkPlugins ?? []),
        [remarkCodeHike, { theme: moonLightTheme, showCopyButton: true }],
      ];
      return options;
    },
  });

  return result;
}
