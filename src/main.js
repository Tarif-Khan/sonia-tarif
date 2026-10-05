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
  "01-carry": "The carry was at Lake Emerald, Yoho National Park",
  "02-ring": "We first started dating January 20th, 2024",
  "03-ring-sky": "We first met at Northeastern University, Boston",
  "04-embrace": "We've been to 5 different countries together",
  "05-sonia": "We both love Indian food",
};

function captionFor(url) {
  const name = decodeURIComponent(url).split("/").pop().replace(/\.[^.]+$/, "");
  return CAPTIONS[name] || "";
}

const gallery = document.getElementById("gallery");
for (const url of getGalleryUrls()) {
  const figure = document.createElement("figure");
  figure.className = "shot";
  const img = document.createElement("img");
  img.src = url;
  img.alt = "Tarif and Sonia";
  img.loading = "lazy";
  img.decoding = "async";
  figure.append(img);
  const fact = captionFor(url);
  if (fact) {
    const caption = document.createElement("figcaption");
    caption.textContent = fact;
    figure.append(caption);
  }
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
