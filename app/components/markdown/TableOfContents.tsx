import { Accordion, List, useMantineTheme } from "@mantine/core";
import { Link } from "@remix-run/react";
import { useEffect, useState } from "react";

export function TableOfContents() {
  const [contents, setContents] = useState<string[]>([]);
  const [contentIds, setContentIds] = useState<string[]>([]);
  const [contentTags, setContentTags] = useState<string[]>([]);
  const theme = useMantineTheme();
  theme.colorScheme = "dark";

  useEffect(() => {
    setTimeout(() => {
      const allTags = document.getElementsByTagName("main");
      const headTags = allTags.item(1)!.children;

      for (let index = 0; index < headTags.length; index++) {
        if (
          headTags[index].nodeName === "H2" ||
          headTags[index].nodeName === "H3"
        ) {
          const heading = headTags[index].lastChild!.nodeValue!;
          const id = headTags[index].id;
          setContents((c) => [...c, heading]);
          setContentIds((c) => [...c, id]);
          setContentTags((c) => [...c, headTags[index].nodeName]);
        }
      }
    }, 100);
  }, []);

  return (
    <Accordion iconPosition="right">
      <Accordion.Item label="Table of contents">
        <List>
          {contents.map((content, index) => (
            <List.Item key={index} data-tag={contentTags[index]}>
              <Link to={`#${contentIds[index]}`}>{content}</Link>
            </List.Item>
          ))}
        </List>
      </Accordion.Item>
    </Accordion>
  );
}
