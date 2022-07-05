import { Button, Group, Paper, ScrollArea } from "@mantine/core";
import type {
  ActionFunction,
  HeadersFunction,
  LoaderFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { Trash, Edit } from "tabler-icons-react";

import type { Note } from "~/models/note.server";
import { deleteNote } from "~/models/note.server";
import { getNote } from "~/models/note.server";
import { requireUserId } from "~/server/session.server";
import { BREAKPOINT } from "~/styles/mantine-styles";
import { CACHE_CONTROL } from "~/utils/constants";

type LoaderData = {
  note: Note;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.noteId, "noteId not found");

  const note = await getNote({ userId, id: params.noteId });
  if (!note) {
    throw new Response("Not Found", { status: 404 });
  }
  return json<LoaderData>(
    { note },
    {
      headers: {
        "Cache-Control": CACHE_CONTROL,
      },
    }
  );
};
export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return {
    "Cache-Control": loaderHeaders.get("Cache-Control")!,
  };
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.noteId, "noteId not found");

  await deleteNote({ userId, id: params.noteId });

  return redirect("/notes");
};

export default function NoteDetailsPage() {
  const data = useLoaderData() as LoaderData;

  return (
    <>
      <ScrollArea style={{ height: 760, marginBottom: 16 }}>
        <Paper
          className="note-content"
          shadow="md"
          p={30}
          radius="md"
          sx={{
            backgroundColor: "#141517",
            [BREAKPOINT]: {
              padding: 16,
            },
          }}
          dangerouslySetInnerHTML={{ __html: data.note.body }}
        ></Paper>
      </ScrollArea>
      <Group>
        <Form method="post">
          <Button
            type="submit"
            color="red"
            sx={{
              marginBottom: 8,
            }}
            leftIcon={<Trash size={14} />}
            compact
          >
            Delete
          </Button>
        </Form>
        <Link to={`/notes/new?id=${data.note.id}`}>
          <Button
            sx={{
              marginBottom: 8,
            }}
            leftIcon={<Edit size={14} />}
            compact
          >
            Edit
          </Button>
        </Link>
      </Group>
    </>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Note not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
