import { Header } from "~/layouts/Header";
import { Container, Text } from "@mantine/core";
import { useStylesHomePage } from "~/styles/mantine-styles";
import type { HeadersFunction } from "@remix-run/node";
import { CACHE_CONTROL } from "~/utils/constants";

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return {
    "Cache-Control": CACHE_CONTROL,
  };
};

export default function Index() {
  const { classes } = useStylesHomePage();
  return (
    <>
      <Header title="MRGB" />
      <main>
        <div className={classes.wrapper}>
          <Container size={700} className={classes.inner}>
            <h1 className={classes.title}>
              Hi! I'm{" "}
              <Text
                component="span"
                variant="gradient"
                gradient={{ from: "#22d3ee", to: "#3b82f6" }}
                inherit
              >
                Ram Gopal
              </Text>{" "}
            </h1>
            <Text className={classes.description} color="dimmed">
              I'm a Senior Software Engineer who, for the last 5+ years, has
              mainly been working with technologies such as JavaScript,
              Typescript, Node.js, and Java.
            </Text>
            <Text className={classes.description} color="dimmed">
              Lately, I've been exploring new frameworks/toolings with Next.js,
              Remix, Nx, Sveltekit etc.
            </Text>
          </Container>
        </div>
      </main>
    </>
  );
}
