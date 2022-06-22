import type { User } from "@prisma/client";
import { Link } from "@remix-run/react";
import { Box, Header as MHeader, Space, Title } from "@mantine/core";

type Props = {
  user?: User;
  title: string;
  isAdmin?: boolean;
  clearCategory?: React.Dispatch<React.SetStateAction<string>>;
};

const setResponsiveStyles = (keys: string[], values: string[]) => {
  const mediaStyles: Record<string, string> = {};
  keys.forEach((key, index) => {
    mediaStyles[key] = values[index];
  });
  return {
    "@media (max-width: 755px)": mediaStyles,
  };
};

export function Header({ user, title, isAdmin, clearCategory }: Props) {
  return (
    <MHeader
      height={60}
      mb={16}
      p="md"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      sx={setResponsiveStyles(["height"], ["60px"])}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          maxWidth: 992,
          alignItems: "center",
        }}
      >
        <Title
          sx={{
            fontSize: 24,
            fontWeight: 500,
          }}
        >
          <Link to="/">M.RGB</Link>
        </Title>

        <Box sx={{ flexGrow: 1 }}></Box>

        <Title
          sx={{
            fontSize: 16,
            fontWeight: 400,
            ":hover": {
              color: "#2196f3",
              borderBottom: "1px solid #2196f3",
            },
          }}
          className="nav-posts"
        >
          <Link to="/posts" prefetch="intent">
            posts
          </Link>
        </Title>
        <Space mr="xs" />
        <Title
          sx={{
            fontSize: 16,
            fontWeight: 400,
            ":hover": {
              color: "#2196f3",
              borderBottom: "1px solid #2196f3",
            },
          }}
          className="nav-categories"
        >
          <Link
            to="/categories"
            prefetch="intent"
            onClick={() => clearCategory && clearCategory("")}
          >
            categories
          </Link>
        </Title>
      </div>
    </MHeader>
  );
}
