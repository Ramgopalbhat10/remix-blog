import type { User } from "@prisma/client";
import { Link } from "@remix-run/react";
import { Avatar, Box, Header as MHeader, Space, Title } from "@mantine/core";
import logo from "~/assets/images/logo.png";
import { useStylesHeaderNav } from "~/styles/mantine-styles";
import { useMediaQuery } from "@mantine/hooks";
import { Drawer } from "./Drawer";
import type { getNoteListItems } from "~/models/note.server";

type Props = {
  user?: User;
  title: string;
  isAdmin?: boolean;
  clearCategory?: React.Dispatch<React.SetStateAction<string>>;
  showDrawer?: boolean;
  notesList?: Awaited<ReturnType<typeof getNoteListItems>>;
};

const setResponsiveStyles = (keys: string[], values: string[]) => {
  const mediaStyles: Record<string, string> = {};
  keys.forEach((key, index) => {
    mediaStyles[key] = values[index];
  });
  return {
    "@media (max-width: 1024px)": mediaStyles,
  };
};

const linkStyles = {
  fontSize: 16,
  fontWeight: 400,
  ":hover": {
    color: "#2196f3",
    borderBottom: "1px solid #2196f3",
  },
};

export function Header({
  user,
  title,
  isAdmin,
  clearCategory,
  showDrawer,
  notesList,
}: Props) {
  const { classes: headerNavClasses } = useStylesHeaderNav();
  const smallDevices = useMediaQuery("(max-width: 767px)");

  return (
    <MHeader
      height={60}
      mb={16}
      className={headerNavClasses.wrapper}
      sx={{
        ...setResponsiveStyles(["padding"], ["16px"]),
      }}
    >
      <div className={headerNavClasses.linksWrapper}>
        {smallDevices && showDrawer && <Drawer notesList={notesList ?? []} />}
        <Title className={headerNavClasses.logoTitle}>
          <Avatar
            src={logo}
            className={headerNavClasses.logoAvatar}
            alt="logo"
          />
          <Link to="/">M.RGB</Link>
        </Title>

        <Box sx={{ flexGrow: 1 }}></Box>

        {title === "Notes" ? (
          <Title sx={linkStyles} className="nav-notes">
            <Link to="/notes" prefetch="intent">
              notes
            </Link>
          </Title>
        ) : (
          <>
            <Title sx={linkStyles} className="nav-posts">
              <Link to="/posts" prefetch="intent">
                posts
              </Link>
            </Title>
            <Space mr="xs" />
            <Title sx={linkStyles} className="nav-categories">
              <Link
                to="/categories"
                prefetch="intent"
                onClick={() => clearCategory && clearCategory("")}
              >
                categories
              </Link>
            </Title>
            {isAdmin && (
              <>
                <Space mr="xs" />
                <Title sx={linkStyles} className="nav-notes">
                  <Link to="/notes" prefetch="intent">
                    notes
                  </Link>
                </Title>
              </>
            )}
          </>
        )}
      </div>
    </MHeader>
  );
}
