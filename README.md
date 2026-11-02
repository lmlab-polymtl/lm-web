# Marsso Lab Website

A static academic lab website built with Astro, content collections, and Decap CMS.

## Local Development

```sh
npm install
npm run dev
```

The CMS lives at `/admin/` and edits Markdown content in `src/content`.

## Deployment

The included GitHub Actions workflow builds the site and publishes `dist` to GitHub Pages.
Set `ASTRO_BASE` in `.github/workflows/deploy.yml` if the site is deployed under a project path.
