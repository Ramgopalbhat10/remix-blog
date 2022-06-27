import type {
  HeadersFunction,
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
  useLocation,
  useMatches,
  useTransition,
} from "@remix-run/react";
import { Global, MantineProvider, useMantineTheme } from "@mantine/core";
import baseStylesheetUrl from "~/styles/base.css";
import nprogressStylesUrl from "nprogress/nprogress.css";
import codeHikeStylesheetsUrl from "@code-hike/mdx/dist/index.css";
import { getUser } from "~/server/session.server";
import { getEnv } from "~/server/env.server";
import { Footer } from "~/layouts/Footer";
import { ScrollToTop } from "~/components";
import { CACHE_CONTROL } from "~/utils/constants";
import { useEffect, useRef } from "react";
import Nprogress from "nprogress";
import { MetronomeLinks } from "@metronome-sh/react";
export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: baseStylesheetUrl },
    { rel: "stylesheet", href: codeHikeStylesheetsUrl },
    { rel: "stylesheet", href: nprogressStylesUrl },
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
    "theme-color": "#1A1B1E",
  };
};
type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
  ENV: ReturnType<typeof getEnv>;
};
export const loader: LoaderFunction = async ({ request }) => {
  return json<LoaderData>(
    { user: await getUser(request), ENV: getEnv() },
    { headers: { "Cache-Control": CACHE_CONTROL } }
  );
};
export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return { "Cache-Control": loaderHeaders.get("Cache-Control")! };
};
export default function App() {
  const data = useLoaderData();
  const theme = useMantineTheme();
  theme.colorScheme = "dark";
  const transition = useTransition();

  let location = useLocation();
  let matches = useMatches();
  let isMount = useRef(true);

  useEffect(() => {
    if (transition.state === "loading" || transition.state === "submitting") {
      Nprogress.start();
    } else {
      Nprogress.done();
    }
  }, [transition.state]);

  useEffect(() => {
    let mounted = isMount;
    isMount.current = false;
    if ("serviceWorker" in navigator) {
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller?.postMessage({
          type: "REMIX_NAVIGATION",
          isMount: mounted,
          location,
          matches,
          manifest: window.__remixManifest,
        });
      } else {
        let listener = async () => {
          await navigator.serviceWorker.ready;
          navigator.serviceWorker.controller?.postMessage({
            type: "REMIX_NAVIGATION",
            isMount: mounted,
            location,
            matches,
            manifest: window.__remixManifest,
          });
        };
        navigator.serviceWorker.addEventListener("controllerchange", listener);
        return () => {
          navigator.serviceWorker.removeEventListener(
            "controllerchange",
            listener
          );
        };
      }
    }
  }, [location]);

  return (
    <html lang="en">
      <head>
        <Meta />
        <link rel="manifest" href="/resources/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png"></link>
        <Links />
        <MetronomeLinks />
      </head>
      <body>
        <Global
          styles={{
            "*, *::before, *::after": { boxSizing: "border-box" },
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
          <div style={{ flex: 1 }}>
            <Outlet />
          </div>
          <Footer /> <ScrollToTop />
        </MantineProvider>
        <ScrollRestoration /> <Scripts />
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
