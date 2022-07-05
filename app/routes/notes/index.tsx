import { Text } from "@mantine/core";
import { Link } from "@remix-run/react";

export default function NoteIndexPage() {
  return (
    <Text
      align="center"
      sx={{
        marginTop: 8,
      }}
    >
      No note selected. Select a note on the left drawer, or{" "}
      <Link
        to="new"
        style={{
          borderBottom: "1px solid #2196f3",
        }}
      >
        create a new note.
      </Link>
    </Text>
  );
}
