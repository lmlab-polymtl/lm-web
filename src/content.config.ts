import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import * as schemas from "./schemas.mjs";

const people = defineCollection({ loader: glob({ pattern: "*.md", base: "./src/content/people" }), schema: schemas.people });
const projects = defineCollection({ loader: glob({ pattern: "*.md", base: "./src/content/projects" }), schema: schemas.projects });
const news = defineCollection({ loader: glob({ pattern: "*.md", base: "./src/content/news" }), schema: schemas.news });
const talks = defineCollection({ loader: glob({ pattern: "*.md", base: "./src/content/talks" }), schema: schemas.talks });
const settings = defineCollection({ loader: glob({ pattern: "*.md", base: "./src/content/settings" }), schema: schemas.settings });

const publications = defineCollection({ loader: glob({ pattern: "*.md", base: "./src/content/publications" }), schema: schemas.publications });

export const collections = {
  people,
  publications,
  projects,
  news,
  talks,
  settings,
};
