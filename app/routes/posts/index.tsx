import { Button, List, Space, Text } from "@mantine/core";
import type { HeadersFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getPostListings } from "~/models/post.server";
import { useOptionalAdminUser } from "~/utils/utils";
import { useStylesHeadingTitle } from "~/styles/mantine-styles";
import { PostList } from "~/containers";
import { CACHE_CONTROL } from "~/utils/constants";

type LoaderData = {
  posts: Awaited<ReturnType<typeof getPostListings>>;
};

export const loader: LoaderFunction = async () => {
  const posts = await getPostListings();
  return json(
    { posts },
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

export default function PostsRoute() {
  const { classes: titleClasses } = useStylesHeadingTitle();
  const { posts } = useLoaderData<LoaderData>();
  const user = useOptionalAdminUser();

  const isAdmin = user?.email === ENV.ADMIN_EMAIL;

  return (
    <>
      <h1 className={titleClasses.title}>Blog Posts</h1>
      <Text
        size="md"
        color="dimmed"
        sx={{
          margin: "1rem 0",
        }}
      >
        Find all the articles on Software Engineering, Fullstack Development,
        etc.
      </Text>
      <hr />
      <List
        sx={{
          marginTop: "1rem",
        }}
      >
        <PostList posts={posts} />
      </List>
      {isAdmin ? (
        <>
          <Space h="lg" />
          <Link to="admin">
            <Button>Admin</Button>
          </Link>
        </>
      ) : null}
    </>
  );
}
