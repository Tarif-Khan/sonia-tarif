import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";

const PHOTO_DIR = path.resolve("public/photos");
const EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

function listPhotos() {
  if (!fs.existsSync(PHOTO_DIR)) return [];
  return fs
    .readdirSync(PHOTO_DIR)
    .filter((file) => EXTS.has(path.extname(file).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((file) => `/photos/${encodeURIComponent(file)}`);
}

function photosPlugin() {
  const virtual = "virtual:photos";
  const resolved = `\0${virtual}`;

  return {
    name: "photos-list",
    resolveId(id) {
      if (id === virtual) return resolved;
    },
    load(id) {
      if (id === resolved) {
        return `export default ${JSON.stringify(listPhotos())}`;
      }
    },
    configureServer(server) {
      if (!fs.existsSync(PHOTO_DIR)) {
        fs.mkdirSync(PHOTO_DIR, { recursive: true });
      }
      fs.watch(PHOTO_DIR, () => {
        const mod = server.moduleGraph.getModuleById(resolved);
        if (mod) {
          server.moduleGraph.invalidateModule(mod);
          server.ws.send({ type: "full-reload" });
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [photosPlugin()],
});
