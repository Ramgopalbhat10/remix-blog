import { List, Text } from "@mantine/core";
import { Link } from "@remix-run/react";
import { useStylesLinks, useStylesPostsList } from "~/styles/mantine-styles";

type Posts = {
  posts: {
    title: string;
    slug: string;
    updatedAt: Date;
    categories: string;
  }[];
  relativePath?: boolean;
};

export function PostList({ posts, relativePath = false }: Posts) {
  const { classes: linkClasses } = useStylesLinks();
  const { classes: postListClasses } = useStylesPostsList();

  const getDateInUTC = (dateUpdated: Date) => {
    const date = new Date(dateUpdated).toUTCString().split(" ");
    const [day, month, year] = [date[1], date[2], date[3]];
    return `${month} ${day} ${year}`;
  };

  return (
    <>
      {posts.map((post) => (
        <List.Item className={linkClasses.links} key={post.slug}>
          <Link
            to={
              relativePath
                ? `/posts/${post.slug}?category=${post.categories}`
                : `${post.slug}?category=${post.categories}`
            }
            prefetch="intent"
            state={{
              category: post.categories,
            }}
          >
            <div className={postListClasses.wrapper}>
              <div className={postListClasses.inner}>
                <Text className={postListClasses.title} size="xl">
                  {post.title}
                </Text>
                <Text className={postListClasses.date} size="xs" color="dimmed">
                  {getDateInUTC(post.updatedAt)}
                </Text>
              </div>
            </div>
          </Link>
        </List.Item>
      ))}
    </>
  );
}
