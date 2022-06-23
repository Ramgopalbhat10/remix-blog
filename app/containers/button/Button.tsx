import type { Sx } from "@mantine/core";
import { Button as MButton } from "@mantine/core";

type ButtonProps = {
  disabled?: boolean;
  name?: string;
  title?: string;
  type?: "button" | "submit" | "reset";
  children?: JSX.Element | string;
  value?: "create" | "update" | "delete";
  sx?: Sx | (Sx | undefined)[] | undefined;
  onClick?: () => void;
};

export function Button({
  disabled,
  name,
  title,
  type = "button",
  children,
  value,
  sx,
  onClick,
}: ButtonProps) {
  const color = value === "delete" ? "red" : "blue";
  return (
    <MButton
      name={name}
      value={value}
      loading={disabled}
      loaderPosition="right"
      type={type}
      variant="filled"
      color={color}
      sx={sx}
      onClick={onClick}
    >
      {children && children}
      {title && title}
    </MButton>
  );
}
