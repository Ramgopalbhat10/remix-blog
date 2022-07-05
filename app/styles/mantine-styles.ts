import type { MantineTheme } from "@mantine/core";
import { createStyles } from "@mantine/core";

export const BREAKPOINT = "@media (max-width: 767px)";
const getTitleStyles = (theme: MantineTheme) => ({
  fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  fontSize: 62,
  fontWeight: 900,
  lineHeight: 1.1,
  margin: 0,
  padding: 0,
  color: theme.colorScheme === "dark" ? theme.white : theme.black,

  [BREAKPOINT]: {
    fontSize: 42,
    lineHeight: 1.2,
  },
});

export const useStylesLinks = createStyles((theme) => ({
  links: {
    listStyle: "none",
    fontSize: 22,
    marginBottom: 12,
    [BREAKPOINT]: {
      fontSize: 16,
    },
  },
}));

export const useStylesHomePage = createStyles((theme) => ({
  wrapper: {
    position: "relative",
    boxSizing: "border-box",
  },

  inner: {
    position: "relative",
    paddingTop: 200,
    paddingBottom: 120,

    [BREAKPOINT]: {
      paddingBottom: 80,
      paddingTop: 80,
    },
  },

  title: getTitleStyles(theme),

  description: {
    marginTop: theme.spacing.xl,
    fontSize: 24,

    [BREAKPOINT]: {
      fontSize: 18,
    },
  },
}));

export const useStylesFooter = createStyles((theme) => ({
  footer: {
    justifyContent: "center",
    marginTop: 8,
    borderTop: "1px solid #2c2e33",
  },
}));

export const useStylesHeadingTitle = createStyles((theme) => ({
  title: getTitleStyles(theme),
}));

export const useStylesPostsList = createStyles((theme) => ({
  wrapper: {
    display: "flex",
    alignItems: "center",
  },
  inner: {
    display: "flex",
    flexDirection: "column",
  },
  title: {
    color: "white",
    ":hover": {
      textDecoration: "underline",
      textDecorationColor: "#2196f3",
    },
    [BREAKPOINT]: {
      fontSize: 16,
    },
  },
  date: {
    [BREAKPOINT]: {
      fontSize: 12,
    },
  },
}));

export const useStylesCategories = createStyles((theme, _params, getRef) => ({
  iconWrapper: {
    ref: getRef("iconWrapper"),
  },

  checked: {
    backgroundColor: `${theme.colors.blue[6]} !important`,
    color: theme.white,

    [`& .${getRef("iconWrapper")}`]: {
      color: theme.white,
    },
  },
}));

export const useStylesHeaderNav = createStyles((theme) => ({
  wrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  linksWrapper: {
    flex: 1,
    display: "flex",
    maxWidth: 992,
    alignItems: "center",
  },
  logoTitle: {
    fontSize: 24,
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
  },
  logoAvatar: {
    position: "relative",
    left: "-6px",
    [BREAKPOINT]: {
      width: 32,
      height: 32,
      minWidth: 32,
    },
  },
  navLinks: {
    fontSize: 16,
    fontWeight: 400,
    ":hover": {
      color: "#2196f3",
      borderBottom: "1px solid #2196f3",
    },
  },
}));

export const useStylesNotes = createStyles((theme) => ({
  link: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    fontSize: theme.fontSizes.sm,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[1]
        : theme.colors.gray[7],
    padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },
  linkActive: {
    "&, &:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.fn.rgba(theme.colors[theme.primaryColor][8], 0.25)
          : theme.colors[theme.primaryColor][0],
      color:
        theme.colorScheme === "dark"
          ? theme.white
          : theme.colors[theme.primaryColor][7],
    },
  },
}));
