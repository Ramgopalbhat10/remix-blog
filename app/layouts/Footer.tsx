import { ActionIcon, Group } from "@mantine/core";
import { BrandTwitter, BrandGithub, BrandLinkedin } from "tabler-icons-react";
import { useStylesFooter } from "~/styles/mantine-styles";

export function Footer() {
  const { classes } = useStylesFooter();

  return (
    <Group spacing={0} noWrap className={classes.footer}>
      <ActionIcon<"a">
        size="md"
        component="a"
        href="https://twitter.com/Batmansubbu"
        target="_blank"
        aria-label="twitter"
      >
        <BrandTwitter size={22} />
      </ActionIcon>
      <ActionIcon
        size="md"
        component="a"
        href="https://github.com/Ramgopalbhat10"
        target="_blank"
        aria-label="github"
        sx={{
          margin: "0 16px",
        }}
      >
        <BrandGithub size={22} />
      </ActionIcon>
      <ActionIcon
        size="md"
        component="a"
        href="https://linkedin.com/in/ramgopal-bhat"
        target="_blank"
        aria-label="linkedin"
      >
        <BrandLinkedin size={22} />
      </ActionIcon>
    </Group>
  );
}
