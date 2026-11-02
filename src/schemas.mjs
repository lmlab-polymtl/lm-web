import { z } from "astro/zod";

// Single source of truth for content rules. Used by the Astro build
// (src/content.config.ts) and by scripts/validate-content.mjs in CI.
// Every object is strict: unknown fields are rejected, not ignored.

export const BODY_LIMITS = {
  people: 5000,
  projects: 4000,
  news: 6000,
  talks: 3000,
  publications: 0,
  settings: 0,
};

const text = (max) => z.string().trim().min(1).max(max);
const slug = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "lowercase letters, numbers and hyphens only").max(80);
const webUrl = z.string().url().max(300).regex(/^https?:\/\//, "must start with http:// or https://");
const uploadPath = z.string().max(200).regex(/^\/uploads\/[\w.\-]+$/, "must be a file in /uploads/, e.g. /uploads/photo.png");
const sitePath = z.string().max(200).regex(/^\/[\w\-/#.]*$/, "internal links must start with / (e.g. /publications)");
const linkUrl = z.union([webUrl, sitePath]);
const date = z.union([z.date(), z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must look like 2026-01-20")]).transform((d) => new Date(d));
const tags = (maxItems, maxLen) => z.array(text(maxLen)).max(maxItems).default([]);

const link = z.object({ label: text(80), url: linkUrl }).strict();
const links = z.array(link).max(10).default([]);

export const people = z.object({
  name: text(80),
  role: text(120),
  group: z.enum(["Faculty", "Lab Members", "PhD", "MSc", "Alumni", "Collaborators"]),
  order: z.number().int().min(0).max(999).default(100),
  pronouns: text(30).optional(),
  isDraft: z.boolean().default(false),
  affiliation: text(160).optional(),
  supervisor: text(80).optional(),
  email: z.string().email().max(120).optional(),
  orcid: z.string().regex(/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/, "format 0000-0000-0000-0000").optional(),
  mila: z.string().url().max(200).regex(/^https:\/\/mila\.quebec\/(en|fr)\/directory\/[\w\-]+\/?$/, "must be a mila.quebec directory link").optional(),
  website: webUrl.optional(),
  github: webUrl.optional(),
  twitter: webUrl.optional(),
  linkedin: webUrl.optional(),
  googleScholar: webUrl.optional(),
  interests: tags(8, 50),
  projects: z.array(slug).max(10).default([]),
  posters: links,
  links,
  image: uploadPath.regex(/\.(png|jpe?g|webp|svg)$/i, "must be png, jpg, webp or svg").optional(),
}).strict();

export const projects = z.object({
  title: text(100),
  status: z.enum(["Active", "Recruiting", "Ongoing", "Archived"]),
  summary: text(300),
  tags: tags(8, 30),
  people: z.array(slug).max(30).default([]),
  peopleCount: z.number().int().min(1).max(100).default(1),
  poster: uploadPath.optional(),
  funding: text(150).optional(),
  featured: z.boolean().default(false),
  links,
}).strict();

export const news = z.object({
  title: text(120),
  date,
  summary: text(300),
  link: linkUrl.optional(),
}).strict();

export const talks = z.object({
  title: text(150),
  speaker: text(80),
  date,
  venue: text(120),
  abstract: text(2000),
  bio: text(800),
  tags: tags(8, 30),
  links,
}).strict();

export const settings = z.object({
  email: z.string().email().max(120),
  office: text(80),
  prospective_students: text(500),
}).strict();

export const publication = z.object({
  id: slug,
  title: text(300),
  year: z.number().int().min(1950).max(new Date().getFullYear() + 1),
  venue: text(150),
  type: z.enum(["Conference", "Journal", "Workshop", "Preprint", "Thesis"]).default("Conference"),
  authors: z.array(text(80)).min(1).max(40),
  award: text(100).optional(),
  showOnProfile: z.boolean().default(true),
  profileOrder: z.number().int().min(0).max(999).default(100),
  researchStreams: tags(6, 60),
  showInLabPublications: z.boolean().default(true),
  selected: z.boolean().default(false),
  source: webUrl.optional(),
  tags: tags(8, 30),
  links,
}).strict();

export const publications = z.object({
  member: slug,
  publications: z.array(publication).max(150).default([]),
}).strict();

export const collections = { people, projects, news, talks, settings, publications };
