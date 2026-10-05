# Tarif & Sonia — Save the Date

Wedding site for **October 31, 2026**, built with Vite and Three.js, ready for Netlify.

The layout is mobile-first. Motion is kept still: no camera drift, parallax, or looping animation. Three.js is used only as a static cover on large, fine-pointer screens; phones use the photograph directly.

## Photos

- **Cover:** `public/cover.jpg` (the Banff proposal photo).
- **Gallery:** numbered files in `public/photos`. `06-running.jpg` is always the last, full-bleed closing image.

Run `npm run dev` — the gallery reloads when files change. The Photos shared album **Geese in Banff** is a good source.

## Local

```bash
npm install
npm run dev
```

## Netlify

- Build command: `npm run build`
- Publish directory: `dist`

Or drag the project onto Netlify after connecting the Git repo.
