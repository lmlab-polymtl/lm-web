import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, extname, basename } from "node:path";
import * as yaml from "js-yaml";
import { collections, BODY_LIMITS } from "../src/schemas.mjs";

const CONTENT = "src/content";
const UPLOADS = "public/uploads";
const SLUG_FILE = /^[a-z0-9]+(-[a-z0-9]+)*\.md$/;
const UPLOAD_LIMITS = {
  ".png": 2, ".jpg": 2, ".jpeg": 2, ".webp": 2, ".svg": 1, ".pdf": 15,
}; // MB

const errors = [];
const fail = (file, msg) => errors.push(`${file}: ${msg}`);

const parsed = {};
for (const name of Object.keys(collections)) {
  parsed[name] = {};
  const dir = join(CONTENT, name);
  if (!existsSync(dir)) continue;

  for (const file of readdirSync(dir)) {
    const path = join(dir, file);
    if (!SLUG_FILE.test(file)) {
      fail(path, "file name must be lowercase letters, numbers and hyphens, ending in .md");
      continue;
    }
    const raw = readFileSync(path, "utf8");
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
    if (!match) {
      fail(path, "missing front matter (the --- block at the top)");
      continue;
    }

    let data;
    try {
      data = yaml.load(match[1]) ?? {};
    } catch (e) {
      fail(path, `front matter is not valid YAML: ${e.message.split("\n")[0]}`);
      continue;
    }

    const result = collections[name].safeParse(data);
    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path.join(".") || "(root)";
        fail(path, `${field}: ${issue.message}`);
      }
      continue;
    }

    const bodyLength = match[2].trim().length;
    if (bodyLength > BODY_LIMITS[name]) {
      fail(path, `body is ${bodyLength} characters, the limit is ${BODY_LIMITS[name]}`);
    }
    parsed[name][file.replace(/\.md$/, "")] = result.data;
  }
}

const upload = (path) => existsSync(join("public", path));
const requireUpload = (file, field, path) => {
  if (path?.startsWith("/uploads/") && !upload(path)) fail(file, `${field}: ${path} does not exist in public/uploads`);
};

for (const [slug, p] of Object.entries(parsed.people)) {
  const file = join(CONTENT, "people", `${slug}.md`);
  requireUpload(file, "image", p.image);
  p.posters.forEach((l, i) => requireUpload(file, `posters.${i}.url`, l.url));
  p.links.forEach((l, i) => requireUpload(file, `links.${i}.url`, l.url));
  for (const proj of p.projects) {
    if (!parsed.projects[proj]) fail(file, `projects: no project named "${proj}"`);
  }
}

for (const [slug, p] of Object.entries(parsed.projects)) {
  const file = join(CONTENT, "projects", `${slug}.md`);
  requireUpload(file, "poster", p.poster);
  p.links.forEach((l, i) => requireUpload(file, `links.${i}.url`, l.url));
  for (const person of p.people) {
    if (!parsed.people[person]) fail(file, `people: no profile named "${person}"`);
  }
}

for (const [slug, p] of Object.entries(parsed.publications)) {
  const file = join(CONTENT, "publications", `${slug}.md`);
  if (p.member !== slug) fail(file, `member "${p.member}" must match the file name "${slug}"`);
  if (!parsed.people[p.member]) fail(file, `member: no profile named "${p.member}" in src/content/people`);
  const seen = new Set();
  for (const pub of p.publications) {
    if (seen.has(pub.id)) fail(file, `duplicate publication id "${pub.id}"`);
    seen.add(pub.id);
    pub.links.forEach((l, i) => requireUpload(file, `${pub.id}.links.${i}.url`, l.url));
  }
}

if (existsSync(UPLOADS)) {
  for (const file of readdirSync(UPLOADS)) {
    const path = join(UPLOADS, file);
    const ext = extname(file).toLowerCase();
    if (!/^[\w.\-]+$/.test(basename(file))) fail(path, "file name may only use letters, numbers, dots, hyphens and underscores");
    else if (!(ext in UPLOAD_LIMITS)) fail(path, `file type ${ext || "(none)"} is not allowed (png, jpg, webp, svg, pdf)`);
    else if (statSync(path).size > UPLOAD_LIMITS[ext] * 1024 * 1024) fail(path, `larger than ${UPLOAD_LIMITS[ext]} MB`);
  }
}

if (errors.length) {
  console.error(`\nContent check failed (${errors.length} problem${errors.length === 1 ? "" : "s"}):\n`);
  for (const e of errors) console.error(`  ${e}`);
  console.error("");
  process.exit(1);
}
console.log("Content check passed.");
