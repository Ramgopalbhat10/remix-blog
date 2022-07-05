import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useSearchParams,
  useTransition,
} from "@remix-run/react";
import * as React from "react";

import { getUserId, createUserSession } from "~/server/session.server";

import { createUser, getUserByEmail } from "~/models/user.server";
import { safeRedirect, validateEmail } from "~/utils/utils";
import {
  Anchor,
  Container,
  Title,
  Text,
  Paper,
  TextInput,
  PasswordInput,
  Button as MButton,
} from "@mantine/core";
import { useForm } from "@mantine/hooks";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

interface ActionData {
  errors?: {
    email?: string;
    password?: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");

  if (!validateEmail(email)) {
    return json<ActionData>(
      { errors: { email: "Email is invalid" } },
      { status: 400 }
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return json<ActionData>(
      { errors: { password: "Password is required" } },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return json<ActionData>(
      { errors: { password: "Password is too short" } },
      { status: 400 }
    );
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return json<ActionData>(
      { errors: { email: "A user already exists with this email" } },
      { status: 400 }
    );
  }

  const user = await createUser(email, password);

  return createUserSession({
    request,
    userId: user.id,
    remember: false,
    redirectTo,
  });
};

export const meta: MetaFunction = () => {
  return {
    title: "Sign Up",
  };
};

export default function Join() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
  const actionData = useActionData() as ActionData;
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
  });

  const transition = useTransition();
  const signupState = transition.state;

  React.useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div>
      <Container size={420} my={40}>
        <Title
          align="center"
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 900,
          })}
        >
          Welcome
        </Title>
        <Text color="dimmed" size="sm" align="center" mt={5}>
          Already have an account?{" "}
          <Anchor>
            <Link
              to={{
                pathname: "/login",
                search: searchParams.toString(),
              }}
            >
              Log In
            </Link>
          </Anchor>
        </Text>
        <Paper
          withBorder
          shadow="md"
          p={30}
          mt={30}
          radius="md"
          sx={{
            backgroundColor: "#141517",
          }}
        >
          <Form method="post">
            <TextInput
              id="email"
              label="Email"
              value={form.values.email}
              onChange={(event) => {
                form.setFieldValue("email", event.currentTarget.value);
                if (actionData) {
                  actionData.errors = undefined;
                }
              }}
              ref={emailRef}
              required
              autoFocus={true}
              name="email"
              type="email"
              placeholder="Email"
              autoComplete="email"
              error={actionData?.errors?.email}
              aria-invalid={actionData?.errors?.email ? true : undefined}
              aria-describedby="email-error"
            />
            <PasswordInput
              id="password"
              label="Password"
              value={form.values.password}
              onChange={(event) => {
                form.setFieldValue("password", event.currentTarget.value);
                if (actionData) {
                  actionData.errors = undefined;
                }
              }}
              ref={passwordRef}
              required
              name="password"
              placeholder="Password"
              autoComplete="current-password"
              error={actionData?.errors?.password}
              aria-invalid={actionData?.errors?.password ? true : undefined}
              aria-describedby="password-error"
              mt="md"
            />
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <MButton
              type="submit"
              mt="xl"
              fullWidth
              name="intent"
              value="login"
              disabled={signupState === "submitting"}
              loading={signupState === "submitting"}
            >
              {signupState === "submitting" ? "Signing up..." : "Sign Up"}
            </MButton>
          </Form>
        </Paper>
      </Container>
    </div>
  );
}
