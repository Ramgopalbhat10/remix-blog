import type { LoaderFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { json } from "@remix-run/node";
import { requireAdminUser } from "~/server/session.server";
import { Button } from "@mantine/core";

export const loader: LoaderFunction = async ({ request }) => {
  await requireAdminUser(request);
  return json({});
};

export default function AdminIndexRoute() {
  return (
    <Link to="new">
      <Button variant="filled">Create new post</Button>
    </Link>
  );
}
