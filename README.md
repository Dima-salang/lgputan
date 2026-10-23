# lgputan
## Commands

```bash
npm install
npm run dev        # local dev server
npm run build      # type-check and build static output
npm run preview    # preview the built site
npm run test       # content and helper tests
npm run lint
npm run format      # check formatting
npm run format:write
```

Node 22.23.4 or newer is required.

## Content

### Writing

Posts live in `src/content/writing/` as Markdown files. The filename becomes the URL slug:

```text
src/content/writing/small-tools.md -> /blog/small-tools
```

Each post needs frontmatter:

```yaml
---
title: Small tools, carefully made
description: A short summary used on the writing index.
date: 2026-10-23
draft: false
---
```

Set `draft: true` while a post is unfinished. Drafts are excluded from the writing index, the home page, the command palette, and the static build. `src/content/writing/post-template.md` is a draft template you can duplicate.

### Projects and skills

Projects live in `src/data/projects.ts`. Each project has a name, description, and an optional list of links.

Skills live in `src/data/skills.ts`, grouped by category. They are rendered with Lucide icons.

### Site copy

Personal details, bio, navigation, and the "now" panel live in `src/data/site.ts`. Social links live in `src/data/links.ts`.

## Deploying

The site outputs pure static HTML to `dist/` and is configured for Vercel in `vercel.json`.

- Build command: `npm run build`
- Output directory: `dist`
- Old `/admin` URLs redirect to `/`

No environment variables or Vercel serverless functions are needed.

## Structure

```text
src/
  components/      Astro components and React islands
  content/         Markdown posts
  content.config.ts
  data/            Typed site, project, skill, and link data
  layouts/         Base HTML layout
  lib/             Date, Markdown, and content helpers
  pages/           Astro routes
  styles.css       Tailwind theme and site styles
```
