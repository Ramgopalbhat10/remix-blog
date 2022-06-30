import { Sandpack } from "@codesandbox/sandpack-react";

type Props = {
  files: Record<string, string>;
};

export function CodeSandbox({ files }: Props) {
  return (
    <>
      <p>Codesandbox</p>
      <Sandpack
        template="react"
        options={{
          showTabs: true,
        }}
        theme="dark"
        files={files}
      />
    </>
  );
}
