import type { Post } from "@prisma/client";
import { getCompiledMdx } from "~/server/compile-mdx.server";
import { prisma, redis } from "~/server/db.server";

export type { Post };

export type Frontmatter = {
  categories: string[];
  date: string;
  description: string;
  heroImageAlt?: string;
  thumbnailImageAlt: string;
  title: string;
  readTime: string;
};

export type PostCache = {
  code: string;
  frontmatter: Frontmatter;
  readTime: string;
};

export async function getPostListings() {
  return prisma.post.findMany({
    orderBy: [
      {
        updatedAt: "desc",
      },
    ],
    select: {
      slug: true,
      title: true,
      updatedAt: true,
      categories: true,
    },
  });
}

export async function getPostCategoriesListing() {
  return prisma.post.findMany({
    distinct: ["categories"],
    select: {
      categories: true,
    },
  });
}

export async function getPosts() {
  return prisma.post.findMany();
}

export async function getPostsByCategories(category: string) {
  return prisma.post.findMany({
    where: { categories: category },
    select: {
      title: true,
      slug: true,
      updatedAt: true,
      categories: true,
    },
  });
}

export async function getPost(slug: string) {
  return prisma.post.findUnique({
    where: { slug },
    select: {
      title: true,
      slug: true,
      updatedAt: true,
      categories: true,
    },
  });
}

export async function getPostWithMarkdown(slug: string) {
  return prisma.post.findUnique({
    where: { slug },
  });
}

export async function getPostInCache(slug: string, category: string) {
  const cachePost = await redis.hget<PostCache>(category, slug);
  return cachePost;
}

export async function createPost(
  post: Pick<Post, "slug" | "title" | "categories"> & { markdown: string }
) {
  const markdown = Buffer.from(post.markdown, "utf-8");
  const newPost = {
    ...post,
    markdown,
  };
  const createdPost = prisma.post.create({ data: newPost });

  // store cache in Redis
  await createPostInCache(post.markdown);
  return createdPost;
}

export async function createPostInCache(markdown: string) {
  const compiledMdx = await getCompiledMdx(markdown);
  const { frontmatter } = compiledMdx;

  const cacheResult = await redis.hset(`${frontmatter["categories"]}`, {
    [frontmatter["slug"]]: compiledMdx,
  });

  if (cacheResult === 0) {
    return `Updated post 📃 ${frontmatter["title"]} in redis cache`;
  } else if (cacheResult === 1) {
    return `Created post 📃 ${frontmatter["title"]} in redis cache`;
  } else {
    return `Neither updated not created post 📃 ${frontmatter["title"]} in redis cache`;
  }
}

export async function updatePost(
  slug: string,
  post: Pick<Post, "slug" | "title" | "categories"> & { markdown: string }
) {
  const markdown = Buffer.from(post.markdown, "utf-8");
  const newPost = {
    ...post,
    markdown,
  };
  const updatedPost = await prisma.post.update({
    data: newPost,
    where: { slug },
  });
  console.log("--------- updated post in DB ---------");
  // store chache in Redis
  await updatePostInCache(slug, post.markdown);
  console.log("--------- updated post in cache ---------");
  return updatedPost;
}

export async function updatePostInCache(slug: string, markdown: string) {
  const compiledMdx = await getCompiledMdx(markdown);
  const { frontmatter } = compiledMdx;

  // delete the existing slug key and add new one in Redis
  await redis.hdel(`${frontmatter["categories"]}`, slug);
  await redis.hset(`${frontmatter["categories"]}`, {
    [frontmatter["slug"]]: compiledMdx,
  });
}

export async function deletePost(slug: string, category: string) {
  // delet data in both Redis and DB
  await redis.hdel(category, slug);
  return prisma.post.delete({ where: { slug } });
}
