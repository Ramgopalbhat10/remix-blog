import type { LoaderFunction } from "@remix-run/node";
import { getPostListings } from "~/models/post.server";

function escapeCdata(s: string) {
  return s.replace(/\]\]>/g, "]]]]><![CDATA[>");
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export const loader: LoaderFunction = async ({ request }) => {
  const posts = await getPostListings();

  const host =
    request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");
  if (!host) {
    throw new Error("Could not determine domain URL.");
  }
  const protocol = host.includes("localhost") ? "http" : "https";
  const domain = `${protocol}://${host}`;
  const postsUrl = `${domain}/posts`;

  const rssString = `
    <rss xmlns:blogChannel="${postsUrl}" version="2.0">
      <channel>
        <title>Remix Jokes</title>
        <link>${postsUrl}</link>
        <description>Blog Posts</description>
        <language>en-us</language>
        <ttl>40</ttl>
        ${posts
          .map((post) =>
            `
            <item>
              <title><![CDATA[${escapeCdata(post.title)}]]></title>
              <description><![CDATA[A blog post on -> ${escapeHtml(
                post.title
              )}]]></description>
              <author><![CDATA[${escapeCdata("Ramgopal")}]]></author>
              <pubDate>${post.updatedAt.toUTCString()}</pubDate>
              <link>${postsUrl}/${post.slug}?category=${post.categories}</link>
              <guid>${postsUrl}/${post.slug}?category=${post.categories}</guid>
            </item>
          `.trim()
          )
          .join("\n")}
      </channel>
    </rss>
  `.trim();

  return new Response(rssString, {
    headers: {
      "Cache-Control": `public, max-age=${60 * 10}, s-maxage=${60 * 60 * 24}`,
      "Content-Type": "application/xml",
      "Content-Length": String(Buffer.byteLength(rssString)),
    },
  });
};
