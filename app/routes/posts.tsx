import { Container } from "@mantine/core";
import { Outlet } from "@remix-run/react";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { DefaultErrorBoundary } from "~/containers";
import postStyles from "~/styles/routes/posts.css";

export const meta: MetaFunction = () => {
  return {
    title: "Blog Posts | MRGB",
    description:
      "All blog posts related to software engineering and programming.",
  };
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: postStyles }];
};

export default function PostsRoute() {
  return (
    <>
      <main>
        <Container size="sm">
          <Outlet />
        </Container>
      </main>
    </>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return <DefaultErrorBoundary error={error} />;
}
