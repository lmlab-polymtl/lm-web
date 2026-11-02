import { defineCollection } from "astro:content";
import * as schemas from "./schemas.mjs";

const people = defineCollection({ type: "content", schema: schemas.people });
const projects = defineCollection({ type: "content", schema: schemas.projects });
const news = defineCollection({ type: "content", schema: schemas.news });
const talks = defineCollection({ type: "content", schema: schemas.talks });
const settings = defineCollection({ type: "content", schema: schemas.settings });

const publications = defineCollection({ type: "content", schema: schemas.publications });

export const collections = {
  people,
  publications,
  projects,
  news,
  talks,
  settings,
};
