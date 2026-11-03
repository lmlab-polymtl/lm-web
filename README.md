# LM Lab Website

A static academic lab website built with Astro and content collections.

## Local Development

```sh
npm install
npm run dev
```

## Deployment

The included GitHub Actions workflow builds the site and publishes `dist` to GitHub Pages.
Set `ASTRO_BASE` in `.github/workflows/deploy.yml` if the site is deployed under a project path.
