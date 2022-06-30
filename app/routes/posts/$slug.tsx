import { getMDXComponent } from "mdx-bundler/client";
import type {
  HeadersFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { Frontmatter } from "~/models/post.server";
import { getPost } from "~/models/post.server";
import { getPostInCache } from "~/models/post.server";
import invariant from "tiny-invariant";
import React from "react";
import { DefaultCatchBoundary, Image } from "~/containers";
import { TableOfContents } from "~/components";
import { CACHE_CONTROL } from "~/utils/constants";
import { Space } from "@mantine/core";
import { getCompiledMdx } from "~/server/compile-mdx.server";

type LoaderData = {
  title: string;
  code: string;
  frontmatter: Frontmatter;
  readTime?: string;
};

export const meta: MetaFunction = ({
  data,
}: {
  data: LoaderData | undefined;
}) => {
  if (!data) {
    return {
      title: "Oops 🤭 | Not found",
      description: "Post not found.",
    };
  }
  return {
    title: `${data.title}`,
    description: `${data.frontmatter?.description}`,
  };
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const { slug } = params;
  invariant(slug, "slug is required");

  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  invariant(category, "category is required");

  const cachedPost = await getPostInCache(slug, category);
  let markdown;
  if (cachedPost?.code) {
    markdown = cachedPost;
    console.log("-------- Rendering from cache ---------");
  } else {
    const originalPost = await getPost(slug);
    markdown = await getCompiledMdx(originalPost!.markdown.toString());
    console.log("-------- Rendering from db ---------");
  }
  if (!cachedPost) {
    throw new Error("Post not found");
  }

  const { code, frontmatter, readTime } = markdown;
  return json(
    { title: frontmatter.title, code, frontmatter, readTime },
    {
      headers: {
        "Cache-Control": CACHE_CONTROL,
      },
    }
  );
};

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return {
    "Cache-Control": loaderHeaders.get("Cache-Control")!,
  };
};

export default function PostRoute() {
  const { title, code, frontmatter, readTime } = useLoaderData<LoaderData>();
  const Component = React.useMemo(() => getMDXComponent(code), [code]);

  return (
    <main>
      <Image
        src={frontmatter?.thumbnailImageAlt}
        title={title}
        blogCategories={frontmatter?.categories}
        dateUpdated={frontmatter?.date}
        readTime={readTime}
      />
      <TableOfContents />
      <Component />
      <Space h="lg" />
    </main>
  );
}

export function CatchBoundary() {
  return <DefaultCatchBoundary />;
}
