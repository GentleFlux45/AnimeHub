# Nighter — Anime Discovery

Discover anime, filter by genre, inspect synopses and official streaming providers, and save your personal watchlist locally in the browser.

## Features

- **Live Catalog Search**: Powered by the public AniList GraphQL API with genre filtering and pagination.
- **Official Watch Links**: Filters external streaming links to trusted licensed platforms.
- **Curated Featured Grid**: Filterable featured anime spotlight with cover artwork.
- **Trending Now & Watchlist**: Live top trending titles and persistent browser `localStorage` watchlist.
- **Light & Dark Themes**: Accessible dual-theme palette persisted across visits.

## Local Development

```bash
npm install
npm run dev
```

## Build Static Bundle

```bash
npm run build
```

The production static site is generated in `dist/`.

## Deploy via GitHub

1. Initialize a Git repository and push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Launch Nighter anime discovery site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```

2. Choose your static host:
   - **Vercel**: Import your GitHub repository in Vercel. `vercel.json` automatically configures `npm run build` and `dist`.
   - **Netlify**: Import your GitHub repository in Netlify. `netlify.toml` automatically configures `npm run build` and `dist`.
   - **GitHub Pages**: In your repository **Settings -> Pages**, set **Source** to **GitHub Actions**. Pushing to `main` triggers `.github/workflows/deploy.yml` automatically.
