import { Badge, Divider, Grid, Group, Image as MImage } from "@mantine/core";
import { Link } from "@remix-run/react";
import { CloudUpload, Clock } from "tabler-icons-react";

type ImageProps = {
  src: string;
  title: string;
  blogCategories?: string[];
  dateUpdated?: string;
  readTime?: string;
};

export function Image({
  src,
  title,
  blogCategories,
  dateUpdated,
  readTime,
}: ImageProps) {
  const date = new Date(dateUpdated!).toUTCString().split(" ");
  const [day, month, year] = [date[1], date[2], date[3]];
  const lastUpdated = `${month} ${day} ${year}`;
  return (
    <Grid
      sx={{
        backgroundColor: "#141517",
        width: "100%",
        margin: "0 auto",
      }}
    >
      <Grid.Col
        span={4}
        sx={{
          padding: "16px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MImage fit="contain" src={src} />
      </Grid.Col>
      <Grid.Col
        span={8}
        sx={{
          padding: "16px 16px 16px 0",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <h1 className="thumbnail-title">{title}</h1>
      </Grid.Col>
      <Grid.Col
        span={12}
        sx={{
          borderTop: "1px solid #373A40",
        }}
      >
        <div
          style={{
            padding: "0 8px",
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
          }}
        >
          <Group
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <p style={{ margin: 0, display: "flex", alignItems: "center" }}>
              <CloudUpload style={{ marginRight: 8 }} size={16} /> {lastUpdated}
            </p>
            <Divider sx={{ height: "24px" }} orientation="vertical" />
            <p style={{ margin: 0, display: "flex", alignItems: "center" }}>
              <Clock style={{ marginRight: 8 }} size={16} />
              {readTime}
            </p>
          </Group>
          <Group>
            {blogCategories?.map((category, index) => (
              <Badge
                variant="filled"
                key={index}
                sx={{
                  textTransform: "inherit",
                }}
              >
                <Link to={`/categories/${category}`}>{category}</Link>
              </Badge>
            ))}
          </Group>
        </div>
      </Grid.Col>
    </Grid>
  );
}
