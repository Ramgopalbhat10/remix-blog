import {
  Form,
  useActionData,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import {
  createPost,
  deletePost,
  getPostWithMarkdown,
  updatePost,
} from "~/models/post.server";
import invariant from "tiny-invariant";
import { requireAdminUser } from "~/server/session.server";
import { Button, DefaultCatchBoundary } from "~/containers";
import { Space, Textarea, TextInput, MultiSelect } from "@mantine/core";
import { useState } from "react";

type ActionData =
  | {
      title: null | string;
      slug: null | string;
      markdown: null | string;
      categories: null | string;
    }
  | undefined;

type LoaderData = {
  post?: {
    markdown: string | undefined;
    slug?: string | undefined;
    title?: string | undefined;
    categories?: string | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
  };
};

export const loader: LoaderFunction = async ({ request, params }) => {
  await requireAdminUser(request);
  invariant(params.slug, "slug is required");

  if (params.slug === "new") {
    return json({});
  }
  const postBuffer = await getPostWithMarkdown(params.slug);
  const markdown = postBuffer?.markdown.toString();
  const post = {
    ...postBuffer,
    markdown,
  };

  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }

  return json<LoaderData>({ post });
};

export const action: ActionFunction = async ({ request, params }) => {
  await requireAdminUser(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  invariant(typeof params.slug === "string", "slug must be a string");

  const categories = formData.get("categories");
  invariant(categories, "categories must be a string");

  if (intent === "delete") {
    await deletePost(params.slug, categories.toString() as string);
    return redirect("/posts/admin");
  }

  const title = formData.get("title");
  const slug = formData.get("slug");
  const markdown = formData.get("markdown");

  const errors: ActionData = {
    title: title ? null : "Title is required",
    slug: slug ? null : "Slug is required",
    markdown: markdown ? null : "Markdown is required",
    categories: categories ? null : "At least one category is required",
  };
  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json(errors);
  }
  invariant(typeof title === "string", "title must be a string");
  invariant(typeof slug === "string", "slug must be a string");
  invariant(typeof markdown === "string", "markdown must be a string");
  invariant(typeof categories === "string", "categories must be a string");

  if (params.slug === "new") {
    await createPost({ title, slug, markdown, categories });
  } else {
    await updatePost(params.slug, { title, slug, markdown, categories });
  }
  return redirect("/posts/admin");
};

export default function NewPostRoute() {
  const [categories, setCategories] = useState(["react", "angular", "vue"]);
  const { post } = useLoaderData<LoaderData>();
  const postCategories = post?.categories?.split(",");
  const errors = useActionData<ActionData>();

  const transition = useTransition();
  const isCreating = transition.submission?.formData.get("intent") === "create";
  const isUpdating = transition.submission?.formData.get("intent") === "update";
  const isDeleting = transition.submission?.formData.get("intent") === "delete";
  const isNewPost = !post;

  return (
    <Form method="post" key={post?.slug ?? "new"}>
      <TextInput
        placeholder="Learning Remix"
        label="Post Title"
        required
        error={errors?.title}
        defaultValue={post?.title}
        name="title"
      />
      <TextInput
        placeholder="learning-remix"
        label="Post Slug"
        required
        error={errors?.slug}
        defaultValue={post?.slug}
        name="slug"
      />
      <MultiSelect
        label="Select Categories"
        data={categories}
        placeholder="react"
        searchable
        creatable
        getCreateLabel={(query) => `+ Create ${query}`}
        onCreate={(query) => setCategories((current) => [...current, query])}
        error={errors?.categories}
        defaultValue={postCategories}
        name="categories"
      />
      <Textarea
        placeholder="Markdown content"
        label="Markdown"
        required
        name="markdown"
        defaultValue={post?.markdown}
        error={errors?.markdown}
        autosize
        minRows={10}
        maxRows={20}
      />
      <div style={{ display: "flex", margin: "16px 0" }}>
        {isNewPost ? null : (
          <>
            <Button
              type="submit"
              name="intent"
              value="delete"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting" : "Delete"}
            </Button>
            <Space w="xs" />
          </>
        )}
        <Button
          type="submit"
          name="intent"
          value={isNewPost ? "create" : "update"}
          disabled={isCreating || isUpdating}
        >
          <>
            {isNewPost ? (isCreating ? "Creating" : "Create Post") : null}
            {isNewPost ? null : isUpdating ? "Updating" : "Update"}
          </>
        </Button>
      </div>
    </Form>
  );
}

export function CatchBoundary() {
  return <DefaultCatchBoundary />;
}
