import type { MantineTheme } from "@mantine/core";
import { createStyles } from "@mantine/core";

export const BREAKPOINT = "@media (max-width: 755px)";
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
    marginTop: 4,
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
