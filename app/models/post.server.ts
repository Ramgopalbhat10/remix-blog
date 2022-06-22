import type { Post } from "@prisma/client";
import { prisma } from "~/server/db.server";

export type { Post };

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
  });
}

export async function createPost(
  post: Pick<Post, "slug" | "title" | "categories"> & { markdown: string }
) {
  const markdown = Buffer.from(post.markdown, "utf-8");
  const newPost = {
    ...post,
    markdown,
  };
  return prisma.post.create({ data: newPost });
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
  return prisma.post.update({ data: newPost, where: { slug } });
}

export async function deletePost(slug: string) {
  return prisma.post.delete({ where: { slug } });
}
