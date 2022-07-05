import type {
  HeadersFunction,
  LinksFunction,
  LoaderFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  NavLink,
  Outlet,
  useLoaderData,
  useLocation,
} from "@remix-run/react";

import { requireUserId } from "~/server/session.server";
import { useUser } from "~/utils/utils";
import { getNoteListItems } from "~/models/note.server";
import { Header } from "~/layouts/Header";
import notesStyles from "~/styles/routes/notes.css";
import { Button, Container, Navbar, Text } from "@mantine/core";
import { useStylesNotes } from "~/styles/mantine-styles";
import { useEffect, useState } from "react";
import { CACHE_CONTROL } from "~/utils/constants";
import { useMediaQuery } from "@mantine/hooks";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: notesStyles }];
};

type LoaderData = {
  noteListItems: Awaited<ReturnType<typeof getNoteListItems>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const noteListItems = await getNoteListItems({ userId });
  return json<LoaderData>(
    { noteListItems },
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

export default function NotesPage() {
  const data = useLoaderData() as LoaderData;
  const user = useUser(true);
  const [active, setActive] = useState("");
  const location = useLocation();
  const smallDevices = useMediaQuery("(max-width: 767px)");

  useEffect(() => {
    if (location.pathname === "/notes") {
      setActive("");
    }
  }, [location.pathname]);

  const { classes: notesClasses, cx } = useStylesNotes();

  return (
    <div>
      <Header
        title="Notes"
        user={user}
        showDrawer={true}
        notesList={data.noteListItems}
      />
      <Container
        sx={{
          margin: 0,
          padding: 0,
          maxWidth: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            padding: "0 16px",
            justifyContent: "center",
          }}
        >
          {data.noteListItems.length === 0 ? (
            <Text>No notes yet</Text>
          ) : (
            <>
              {!smallDevices && (
                <Navbar
                  height={800}
                  width={{ sm: 300 }}
                  p="md"
                  sx={{
                    padding: "0 16px 0 0 !important",
                    marginRight: 16,
                  }}
                >
                  <Navbar.Section grow>
                    {data.noteListItems.map((note) => (
                      <NavLink
                        to={note.id}
                        key={note.id}
                        className={cx(notesClasses.link, {
                          [notesClasses.linkActive]: note.title === active,
                        })}
                        onClick={() => setActive(note.title)}
                      >
                        📝 {note.title}
                      </NavLink>
                    ))}
                  </Navbar.Section>
                  <Navbar.Section>
                    <Link to="new" onClick={() => setActive("")}>
                      <Button compact>+ New Note</Button>
                    </Link>
                  </Navbar.Section>
                </Navbar>
              )}
              <div
                style={{
                  flexGrow: 1,
                  maxWidth: "900px",
                }}
              >
                <Outlet />
              </div>
            </>
          )}
        </div>
      </Container>
    </div>
  );
}
