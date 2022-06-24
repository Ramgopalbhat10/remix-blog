import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { PostList } from "~/containers";
import type { Post } from "~/models/post.server";
import { getPostsByCategories } from "~/models/post.server";
import { CACHE_CONTROL } from "~/utils/constants";

type LoaderData = {
  posts: Pick<Post, "slug" | "title" | "categories" | "updatedAt">[];
};

export const loader: LoaderFunction = async ({ params }) => {
  const { category } = params;
  invariant(category, "category is required");

  const posts = await getPostsByCategories(category);
  if (!posts) {
    throw new Response("Not Found", { status: 404 });
  }
  return json(
    { posts },
    {
      headers: {
        "Cache-Control": CACHE_CONTROL,
      },
    }
  );
};

export default function CategoryRoute() {
  const { posts } = useLoaderData<LoaderData>();

  return <PostList posts={posts} relativePath={true} />;
}
