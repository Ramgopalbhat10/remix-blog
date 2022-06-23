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

import { createUserSession, getUserId } from "~/server/session.server";
import { verifyLogin } from "~/models/user.server";
import { safeRedirect, validateEmail } from "~/utils";
import { Header } from "~/layouts/Header";
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Button as MButton,
} from "@mantine/core";
import { Button } from "~/containers";
import { useForm } from "@mantine/hooks";

export const meta: MetaFunction = () => {
  return {
    title: "🔐 Admin Login | MRGB",
    description: "Login with admin credentials to modify the content.",
  };
};

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
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/notes");
  const remember = formData.get("remember");

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

  const user = await verifyLogin(email, password);

  if (!user) {
    return json<ActionData>(
      { errors: { email: "Invalid email or password" } },
      { status: 400 }
    );
  }

  return createUserSession({
    request,
    userId: user.id,
    remember: remember === "on" ? true : false,
    redirectTo,
  });
};

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/notes";
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
  const loginState = transition.state;

  React.useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <>
      <Header title="MRGB" />
      <main>
        <Container size={420} my={40}>
          <Title
            align="center"
            sx={(theme) => ({
              fontFamily: `Greycliff CF, ${theme.fontFamily}`,
              fontWeight: 900,
            })}
          >
            Welcome Admin!
          </Title>
          <Text color="dimmed" size="sm" align="center" mt={5}>
            Do not have an admin account yet?{" "}
            <Anchor>
              <Link
                to={{
                  pathname: "/join",
                  search: searchParams.toString(),
                }}
              >
                Sign up
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
                placeholder="Admin email"
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
                placeholder="Admin password"
                autoComplete="current-password"
                error={actionData?.errors?.password}
                aria-invalid={actionData?.errors?.password ? true : undefined}
                aria-describedby="password-error"
                mt="md"
              />
              <input type="hidden" name="redirectTo" value={redirectTo} />
              <Checkbox
                id="remember"
                name="remember"
                label="Remember me"
                mt="xl"
              />
              <MButton
                type="submit"
                mt="xl"
                fullWidth
                name="intent"
                value="login"
                disabled={loginState === "submitting"}
                loading={loginState === "submitting"}
              >
                {loginState === "submitting" ? "Logging In" : "Log In"}
              </MButton>
            </Form>
          </Paper>
        </Container>
      </main>
    </>
  );
}
