import RichTextEditor from "@mantine/rte";

type Props = {
  value: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  id?: string;
};

export function TextEditor({ value, onChange, id }: Props) {
  return (
    <>
      <RichTextEditor
        value={value}
        onChange={onChange}
        id={id}
        sx={{
          marginTop: 4,
          height: "99%",
        }}
      />
    </>
  );
}
