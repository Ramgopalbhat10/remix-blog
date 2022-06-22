import { bundleMDX } from "mdx-bundler";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { h } from "hastscript";
import path from "path";
import { theme } from "~/styles/moonlight-theme";

const rehypeOptions = {
  // theme: "one-dark-pro",
  theme: JSON.parse(JSON.stringify(theme)),
  onVisitLine(node: any) {
    if (node.children.length === 0) {
      node.children = [{ type: "text", value: " " }];
    }
  },
  onVisitHighlightedLine(node: any) {
    node.properties.className.push("highlighted");
  },
  onVisitHighlightedWord(node: any) {
    node.properties.className = ["word"];
  },
};

export default async function compileMDX(markdown: string) {
  const directory = path.join(process.cwd(), "/app");
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

  const result = await bundleMDX({
    source: markdown,
    cwd: directory,
    mdxOptions(options) {
      options.rehypePlugins = [
        ...(options?.rehypePlugins ?? []),
        rehypeSlug,
        [rehypePrettyCode, rehypeOptions],
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
      options.remarkPlugins = [...(options?.remarkPlugins ?? [])];
      return options;
    },
  });

  return result;
}
