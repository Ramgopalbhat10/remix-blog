import { Button, Divider, Drawer as MDrawer } from "@mantine/core";
import { Link, NavLink } from "@remix-run/react";
import { useState } from "react";
import { AlignJustified } from "tabler-icons-react";
import type { getNoteListItems } from "~/models/note.server";
import { useStylesNotes } from "~/styles/mantine-styles";

type Props = {
  notesList: Awaited<ReturnType<typeof getNoteListItems>>;
};

export function Drawer({ notesList }: Props) {
  const [opened, setOpened] = useState(false);
  const [active, setActive] = useState("");
  const { classes: notesClasses, cx } = useStylesNotes();

  const noteLinks = notesList.map((note) => (
    <NavLink
      to={note.id}
      key={note.id}
      className={cx(notesClasses.link, {
        [notesClasses.linkActive]: note.title === active,
      })}
      onClick={() => {
        setActive(note.title);
        setOpened(false);
      }}
    >
      📝 {note.title}
    </NavLink>
  ));

  return (
    <>
      <MDrawer
        opened={opened}
        onClose={() => setOpened(false)}
        title="Your Notes"
        padding="md"
        size="md"
        transition="slide-right"
        transitionDuration={250}
        transitionTimingFunction="ease"
      >
        <Divider size="xs" style={{ marginBottom: "10px" }} />
        <div
          style={{
            flex: 1,
          }}
        >
          {noteLinks}
        </div>
        <Divider size="xs" style={{ marginBottom: "16px" }} />
        <Link
          to="new"
          onClick={() => {
            setActive("");
            setOpened(false);
          }}
        >
          <Button compact>+ New Note</Button>
        </Link>
      </MDrawer>
      <Button
        onClick={() => setOpened(true)}
        variant="subtle"
        size="xs"
        style={{ marginRight: "10px", padding: 0 }}
      >
        <AlignJustified size={24} strokeWidth={1.5} color={"#c1c2c5"} />
      </Button>
    </>
  );
}
