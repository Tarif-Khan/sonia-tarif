import { getGalleryUrls, getFinaleUrl } from "./photos.js";
import "./styles.css";

// The passcode is stored in plain text on purpose — this is an evite, not a vault.
const PASSCODE = "10312026";
const UNLOCKED_KEY = "sonia-tarif-unlocked";

const gate = document.getElementById("gate");
const site = document.getElementById("site");
const gateForm = document.getElementById("gate-form");
const gateInput = document.getElementById("gate-password");
const gateError = document.getElementById("gate-error");

function shouldUseScene() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return false;
  }
  if (window.matchMedia("(max-width: 900px), (pointer: coarse)").matches) {
    return false;
  }
  return true;
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

const MAPS_URL = "https://www.google.com/maps?q=40.6746374,-73.9765659&z=16";
const MAPS_EMBED =
  "https://www.google.com/maps?q=40.6746374,-73.9765659&z=16&output=embed";

// Everything here needs layout to be visible first (the WebGL cover sizes itself
// once the site is shown), so it runs only after the gate opens.
function initSite() {
  const canvas = document.getElementById("scene");
  if (canvas && shouldUseScene()) {
    import("./scene.js").then(({ createScene }) => createScene(canvas));
  } else {
    canvas?.remove();
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
      <div>
        <dt>When</dt>
        <dd>Saturday, October 31, 2026</dd>
      </div>
      <div>
        <dt>Time</dt>
        <dd>5:30 PM – 10:00 PM<span class="detail-sub">Ceremony begins at 6:00 PM</span></dd>
      </div>
      <div>
        <dt>Where</dt>
        <dd>
          <a href="${MAPS_URL}" target="_blank" rel="noopener">Scottadito Osteria Toscana</a>
          <span class="detail-sub">788A Union Street, Brooklyn, NY 11215</span>
          <span class="detail-sub">A cozy Tuscan kitchen in the heart of Park Slope</span>
        </dd>
      </div>
    </dl>
    <iframe
      class="map"
      src="${MAPS_EMBED}"
      title="Map to Scottadito Osteria Toscana, 788A Union Street, Brooklyn"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
      allowfullscreen
    ></iframe>
    <p class="detail-note">Dinner, dancing, and a whole lot of love to follow.</p>`;
  gallery.append(details);

  const finaleFrame = document.getElementById("finale-photo");
  const finaleUrl = getFinaleUrl();
  if (finaleUrl && finaleFrame) {
    finaleFrame.src = finaleUrl;
  }
}

let initialized = false;

function revealSite() {
  gate?.remove();
  site.hidden = false;
  if (!initialized) {
    initialized = true;
    initSite();
  }
}

if (sessionStorage.getItem(UNLOCKED_KEY) === PASSCODE) {
  revealSite();
} else {
  gateInput.focus({ preventScroll: true });
  gateForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (gateInput.value.trim() === PASSCODE) {
      sessionStorage.setItem(UNLOCKED_KEY, PASSCODE);
      revealSite();
    } else {
      gateError.hidden = false;
      gateInput.value = "";
      gateInput.focus({ preventScroll: true });
    }
  });
}
