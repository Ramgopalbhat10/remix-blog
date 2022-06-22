import { AppShell as MAppShell } from "@mantine/core";

export function AppShell({ children }: { children: JSX.Element }) {
  return <MAppShell padding="md">{children}</MAppShell>;
}
