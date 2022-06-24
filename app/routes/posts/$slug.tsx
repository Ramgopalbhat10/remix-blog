import { getMDXComponent } from "mdx-bundler/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getPost } from "~/models/post.server";
import invariant from "tiny-invariant";
import React from "react";
import compileMDX from "~/server/compile-mdx.server";
import { DefaultCatchBoundary, Image } from "~/containers";
import { TableOfContents } from "~/components";
import type { ReadTimeResults } from "reading-time";
import readingTime from "reading-time";
import { CACHE_CONTROL } from "~/utils/constants";

type Frontmatter = {
  categories: string[];
  date: string;
  description: string;
  heroImageAlt?: string;
  thumbnailImageAlt: string;
  title: string;
};

type LoaderData = {
  title: string;
  code: string;
  frontmatter: Frontmatter;
  readTime: ReadTimeResults;
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

  const post = await getPost(slug);
  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }
  const markdown = post.markdown.toString();
  const readTime = readingTime(markdown);
  const result = await compileMDX(markdown);
  const { code, frontmatter } = result;
  return json(
    { title: post.title, code, frontmatter, readTime },
    {
      headers: {
        "Cache-Control": CACHE_CONTROL,
      },
    }
  );
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
        readTime={readTime.text}
      />
      <TableOfContents />
      <Component />
    </main>
  );
}

export function CatchBoundary() {
  return <DefaultCatchBoundary />;
}
