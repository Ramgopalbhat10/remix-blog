import type { ActionFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { Button } from "~/containers";

import { logout } from "~/server/session.server";

export const action: ActionFunction = async ({ request }) => {
  return logout(request);
};

export default function LogoutPage() {
  return (
    <Form action="/logout" method="post">
      <Button type="submit">Logout</Button>
    </Form>
  );
}
