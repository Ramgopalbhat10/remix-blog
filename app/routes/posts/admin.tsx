import { Link, Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getPostListings } from "~/models/post.server";
import { requireAdminUser } from "~/server/session.server";
import { DefaultErrorBoundary } from "~/containers/error/DefaultErrorBoundary";
import { Breadcrumbs, List, Space, Text } from "@mantine/core";
import { useStylesHeadingTitle } from "~/styles/mantine-styles";
import { PostList } from "~/containers";
import { CACHE_CONTROL } from "~/utils/constants";

type LoaderData = {
  posts: Awaited<ReturnType<typeof getPostListings>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  await requireAdminUser(request);
  return json(
    { posts: await getPostListings() },
    {
      headers: {
        "Cache-Control": CACHE_CONTROL,
      },
    }
  );
};

const navItems = [
  { title: "posts", href: "/posts" },
  { title: "admin", href: "/posts/admin" },
].map((item, index) => (
  <Link
    to={item.href}
    prefetch="intent"
    key={index}
    style={{ color: "#2196f3" }}
  >
    {item.title}
  </Link>
));

export default function AdminRoute() {
  const { classes: titleClasses } = useStylesHeadingTitle();
  const { posts } = useLoaderData<LoaderData>();

  return (
    <div>
      <Breadcrumbs>{navItems}</Breadcrumbs>
      <Space h="xl" />
      <h1 className={titleClasses.title}>Blog Admin</h1>
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
      <div>
        <List
          sx={{
            marginTop: "1rem",
          }}
        >
          <PostList posts={posts} />
        </List>
        <Space h="xl" />
        <Outlet />
      </div>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return <DefaultErrorBoundary error={error} />;
}
