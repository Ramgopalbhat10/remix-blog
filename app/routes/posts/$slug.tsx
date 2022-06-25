import { getMDXComponent } from "mdx-bundler/client";
import type {
  HeadersFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { Frontmatter, PostCache } from "~/models/post.server";
import { getPostInCache } from "~/models/post.server";
import invariant from "tiny-invariant";
import React from "react";
import { DefaultCatchBoundary, Image } from "~/containers";
import { TableOfContents } from "~/components";
import { CACHE_CONTROL } from "~/utils/constants";

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
    description: `${data.frontmatter.description}`,
  };
};

export const loader: LoaderFunction = async ({ params }) => {
  const { slug } = params;
  invariant(slug, "slug is required");

  const cachedPost = await getPostInCache(slug);
  if (!cachedPost) {
    throw new Error("Post not found");
  }

  const { code, frontmatter, readTime } = cachedPost as PostCache;
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
    </main>
  );
}

export function CatchBoundary() {
  return <DefaultCatchBoundary />;
}
