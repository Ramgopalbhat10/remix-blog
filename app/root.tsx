import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { Global, MantineProvider, useMantineTheme } from "@mantine/core";

import baseStylesheetUrl from "./styles/base.css";
import codeHikeStylesheetsUrl from "@code-hike/mdx/dist/index.css";
import { getUser } from "./server/session.server";
import { getEnv } from "~/server/env.server";
import { Footer } from "~/layouts/Footer";
import { ScrollToTop } from "./components";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: baseStylesheetUrl },
    { rel: "stylesheet", href: codeHikeStylesheetsUrl },
  ];
};

export const meta: MetaFunction = ({ data, location, params }) => {
  const siteName = "https://mrgb.in";
  const description = "My personal website with blog posts and code snippets.";
  const ogTitle =
    location.pathname.slice(1).charAt(0).toUpperCase() +
    location.pathname.slice(2);

  return {
    charset: "utf-8",
    title: "MRGB | Not a 10X Developer 🧑‍💻",
    description: `${description}`,
    keywords: "Ramgopal,MRGB,Ramgopal Bhat,programming,software development",

    "og:type": "article",
    "og:title": `${ogTitle}`,
    "og:description": `${description}`,
    "og:url": `${siteName}${location.pathname}`,
    "og:site_name": `${siteName}`,
    "og:locale": "en_US",

    "twitter:card": "summary_large_image",
    "twitter:creator": "@Batmansubbu",
    "twitter:site": "@Batmansubbu",
    "twitter:title": "MRGB | Not a 10X Developer 🧑‍💻",
    "twitter:description": `${description}`,

    viewport: "width=device-width,initial-scale=1",
  };
};

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
  ENV: ReturnType<typeof getEnv>;
};

export const loader: LoaderFunction = async ({ request }) => {
  return json<LoaderData>({
    user: await getUser(request),
    ENV: getEnv(),
  });
};

export default function App() {
  const data = useLoaderData();
  const theme = useMantineTheme();
  theme.colorScheme = "dark";

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Global
          styles={{
            "*, *::before, *::after": {
              boxSizing: "border-box",
            },

            body: {
              ...theme.fn.fontStyles(),
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[7]
                  : theme.white,
              color:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[0]
                  : theme.black,
              lineHeight: theme.lineHeight,
            },
          }}
        />
        <MantineProvider theme={{ colorScheme: "dark" }}>
          <Outlet />
          <Footer />
          <ScrollToTop />
        </MantineProvider>
        <ScrollRestoration />
        <Scripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
          }}
        />
        <LiveReload />
      </body>
    </html>
  );
}
