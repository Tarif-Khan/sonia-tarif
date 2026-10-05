import { getGalleryUrls, getFinaleUrl } from "./photos.js";
import "./styles.css";

function shouldUseScene() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return false;
  }
  if (window.matchMedia("(max-width: 900px), (pointer: coarse)").matches) {
    return false;
  }
  return true;
}

const canvas = document.getElementById("scene");
if (canvas && shouldUseScene()) {
  import("./scene.js").then(({ createScene }) => createScene(canvas));
} else {
  canvas?.remove();
}

const CAPTIONS = {
  "01-carry": "The carry — Lake Louise",
  "02-ring": "The ring",
  "03-ring-sky": "Ring & sky",
  "04-embrace": "The embrace",
  "05-sonia": "Sonia",
};

function captionFor(url) {
  const name = decodeURIComponent(url).split("/").pop().replace(/\.[^.]+$/, "");
  return CAPTIONS[name] || "Banff, Alberta";
}

const gallery = document.getElementById("gallery");
for (const url of getGalleryUrls()) {
  const figure = document.createElement("figure");
  figure.className = "shot";
  const img = document.createElement("img");
  img.src = url;
  img.alt = `Tarif and Sonia in Banff — ${captionFor(url)}`;
  img.loading = "lazy";
  img.decoding = "async";
  figure.append(img);
  const caption = document.createElement("figcaption");
  caption.textContent = captionFor(url);
  figure.append(caption);
  gallery.append(figure);
}

const details = document.createElement("aside");
details.className = "details";
details.innerHTML = `
  <p class="details-kicker">Details</p>
  <dl>
    <div><dt>When</dt><dd>October 31, 2026</dd></div>
    <div><dt>Where</dt><dd>Will be announced shortly</dd></div>
    <div><dt>RSVP</dt><dd>Invitations to follow</dd></div>
  </dl>`;
gallery.append(details);

const finaleFrame = document.getElementById("finale-photo");
const finaleUrl = getFinaleUrl();
if (finaleUrl && finaleFrame) {
  finaleFrame.src = finaleUrl;
}
