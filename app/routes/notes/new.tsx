import { Button, ScrollArea, Textarea, TextInput } from "@mantine/core";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import { TextEditor } from "~/components";
import { Refresh } from "tabler-icons-react";

import type { Note } from "~/models/note.server";
import { updateNote } from "~/models/note.server";
import { createNote, getNote } from "~/models/note.server";
import { requireUserId } from "~/server/session.server";
import { useEffect, useRef, useState } from "react";
import { DefaultCatchBoundary, DefaultErrorBoundary } from "~/containers";
import invariant from "tiny-invariant";

type ActionData = {
  errors?: {
    title?: string;
    body?: string;
  };
};
type LoaderData = {
  note: Note;
};

export const loader: LoaderFunction = async ({ request }) => {
  const { url } = request;
  const { searchParams } = new URL(url);
  const id = searchParams.get("id");

  if (!id) {
    return json({});
  }
  const userId = await requireUserId(request);
  const note = await getNote({ userId, id });
  if (!note) {
    throw new Response("Not Found", { status: 404 });
  }
  return json<LoaderData>({ note });
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const title = formData.get("title");
  const body = formData.get("body");
  const intent = formData.get("intent");
  const noteId = formData.get("noteId");

  if (typeof title !== "string" || title.length === 0) {
    return json<ActionData>(
      { errors: { title: "Title is required" } },
      { status: 400 }
    );
  }

  if (typeof body !== "string" || body.length === 0) {
    return json<ActionData>(
      { errors: { body: "Body is required" } },
      { status: 400 }
    );
  }

  let note: Note | undefined;

  if (intent === "create") {
    note = await createNote({ title, body, userId });
  } else if (intent === "update") {
    invariant(noteId, "id must be a specified");
    const id = noteId as string;
    note = await updateNote({ id, title, body, userId });
  }
  return redirect(`/notes/${note?.id}`);
};

export default function NewNotePage() {
  const actionData = useActionData() as ActionData;
  const data = useLoaderData() as LoaderData;
  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const [value, onChange] = useState(() =>
    data && data.note ? data.note.body : "<p>Hi</p>"
  );
  const [title, setTitle] = useState("");

  const transition = useTransition();
  const isCreating = transition.submission?.formData.get("intent") === "create";
  const isUpdating = transition.submission?.formData.get("intent") === "update";

  useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus();
    } else if (actionData?.errors?.body) {
      bodyRef.current?.focus();
    }

    if (data && data.note) {
      setTitle(data.note.title);
      onChange(data.note.body);
    } else {
      setTitle("");
      onChange("");
    }
  }, [actionData, data]);

  return (
    <Form method="post">
      {data.note && (
        <TextInput
          id="noteId"
          name="noteId"
          value={data.note.id}
          sx={{
            display: "none",
          }}
          onChange={() => {}}
        />
      )}
      <TextInput
        ref={titleRef}
        id="title"
        name="title"
        label="Title"
        placeholder="Note title"
        aria-invalid={actionData?.errors?.title ? true : undefined}
        aria-errormessage={
          actionData?.errors?.title ? "title-error" : undefined
        }
        error={actionData?.errors?.title}
        required
        value={title}
        onChange={() => setTitle(title)}
      />
      <Textarea
        ref={bodyRef}
        id="body"
        name="body"
        label="Body"
        placeholder="Note content"
        minRows={5}
        maxRows={5}
        aria-invalid={actionData?.errors?.body ? true : undefined}
        aria-errormessage={actionData?.errors?.title ? "body-error" : undefined}
        error={actionData?.errors?.body}
        required
        value={value}
        onChange={() => {}}
      />
      <label
        style={{
          fontSize: 14,
          fontWeight: 500,
        }}
      >
        Body
      </label>
      <ScrollArea style={{ height: 495, marginBottom: 16 }}>
        <TextEditor value={value} onChange={onChange} />
      </ScrollArea>
      <div
        style={{
          marginTop: "16px",
        }}
      >
        {data.note ? (
          <Button
            type="submit"
            name="intent"
            value="update"
            compact
            leftIcon={<Refresh size={14} />}
            color="green"
            disabled={isUpdating}
            loading={isUpdating}
          >
            {isUpdating ? "Updating" : "Update"}
          </Button>
        ) : (
          <Button
            type="submit"
            name="intent"
            value="create"
            compact
            color="green"
            disabled={isCreating}
            loading={isCreating}
          >
            {isCreating ? "Creating" : "+ Create"}
          </Button>
        )}
      </div>
    </Form>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return <DefaultErrorBoundary error={error} />;
}

export function CatchBoundary() {
  return <DefaultCatchBoundary />;
}
