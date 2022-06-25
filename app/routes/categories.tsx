import { Chip, Chips, Container, Text } from "@mantine/core";
import type {
  HeadersFunction,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Outlet,
  useLoaderData,
  useMatches,
  useNavigate,
} from "@remix-run/react";
import { useState } from "react";
import { Header } from "~/layouts/Header";
import { getPostCategoriesListing } from "~/models/post.server";
import {
  useStylesCategories,
  useStylesHeadingTitle,
} from "~/styles/mantine-styles";
import categoriesStyles from "~/styles/routes/categories.css";
import { CACHE_CONTROL } from "~/utils/constants";

export const meta: MetaFunction = () => {
  return {
    title: "Blog Categories | MRGB",
    description:
      "All blog posts related to software engineering and programming filtered by their categories.",
  };
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: categoriesStyles }];
};

type LoaderData = {
  categories: string[];
};

export const loader: LoaderFunction = async () => {
  const categoriesList = await getPostCategoriesListing();
  const categories = categoriesList.map((category) => category.categories);
  return json(
    { categories },
    {
      headers: {
        "Cache-Control": CACHE_CONTROL,
      },
    }
  );
};

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return {
    "Cache-Control": loaderHeaders.get("Cache-Control")!,
  };
};

export default function CategoriesRoute() {
  const { classes: titleClasses } = useStylesHeadingTitle();
  const { classes: categoryClasses } = useStylesCategories();
  const { categories } = useLoaderData<LoaderData>();
  const matches = useMatches();
  const [selectedCategory, setSelectedCategory] = useState(() => {
    const path = matches[0].params["category"];
    return path ? path : "";
  });
  let navigate = useNavigate();

  return (
    <>
      <Header title="MRGB" clearCategory={setSelectedCategory} />
      <main>
        <Container size="sm">
          <h1 className={titleClasses.title}>Blog Categories</h1>
          <Text
            size="md"
            color="dimmed"
            sx={{
              margin: "1rem 0",
            }}
          >
            Find all the articles filtered by their categories.
          </Text>
          <hr />
          <Chips
            sx={{
              margin: "1rem 0",
            }}
            multiple={false}
            classNames={categoryClasses}
            value={selectedCategory}
            onChange={(value) => {
              setSelectedCategory(value);
              navigate(value);
            }}
          >
            {categories.map((category, index) => (
              <Chip variant="filled" key={index} value={category}>
                {/* <Link to={category}>{category}</Link> */}
                {category}
              </Chip>
            ))}
          </Chips>
          {selectedCategory === "" && (
            <p>Select any category to get list of articles</p>
          )}
          <Outlet />
        </Container>
      </main>
    </>
  );
}
