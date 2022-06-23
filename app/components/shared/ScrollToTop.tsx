import { useWindowEvent, useWindowScroll } from "@mantine/hooks";
import { useState } from "react";
import { ChevronUp } from "tabler-icons-react";
import { Button } from "~/containers";

export function ScrollToTop() {
  const [_scroll, scrollTo] = useWindowScroll();
  const [visible, setVisible] = useState(false);

  const scrollHandler = (event: Event) => {
    window.scrollY > 400 ? setVisible(true) : setVisible(false);
  };
  useWindowEvent("scroll", scrollHandler);

  const scrollAndHide = () => {
    scrollTo({ y: 0 });
    setVisible(false);
  };

  return (
    <>
      {visible && (
        <Button
          sx={{
            position: "fixed",
            bottom: "5%",
            right: "5%",
            padding: "0 6px",
            borderRadius: "50%",
          }}
          onClick={scrollAndHide}
        >
          <ChevronUp size={24} />
        </Button>
      )}
    </>
  );
}
