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

const TIMELINE = [
  { src: "/timeline/01-first-photo.jpg", date: "January 28, 2024", caption: "Our first ever photo" },
  { src: "/timeline/02-first-valentines.jpg", date: "February 14, 2024", caption: "Our first Valentine's" },
  { src: "/timeline/03-sonia-birthday.jpg", date: "March 3, 2024", caption: "Sonia's first birthday party" },
  { src: "/timeline/04-first-nyc-date-v2.jpg", date: "August 4, 2024", caption: "First NYC date" },
  { src: "/timeline/05-halloween.jpg", date: "October 31, 2024", caption: "Halloween costumes together — Grimace and victim" },
  { src: "/timeline/06-valentines-california.jpg", date: "February 14, 2025", caption: "Valentine's Day in California" },
  { src: "/timeline/07-graduation-1.jpg", date: "May 11, 2025", caption: "Graduation" },
  { src: "/timeline/08-graduation-2.jpg", date: "May 11, 2025", caption: "More graduation" },
  { src: "/timeline/09-donald-birthday.jpg", date: "September 15, 2025", caption: "Donald's first birthday together" },
  { src: "/timeline/10-zion-hike.jpg", date: "October 12, 2025", caption: "First real hike with Sonia — Zion National Park" },
  { src: "/timeline/11-emily-khoji.jpg", date: "October 25, 2025", caption: "Emily and Khoji" },
  { src: "/timeline/12-housewarming.jpg", date: "November 9, 2025", caption: "A friend's housewarming" },
  { src: "/timeline/13-new-years.jpg", date: "January 1, 2026", caption: "New Year's 2026" },
  { src: "/timeline/14-july-fourth.jpg", date: "July 4, 2026", caption: "July 4th" },
  { src: "/timeline/15-tarif-birthday-v3.jpg", date: "September 24, 2026", caption: "Tarif's birthday" },
  { src: "/photos/01-carry.jpg", date: "October 3, 2026", caption: "The proposal at Lake Emerald" },
];

function initTabs(gallery, timeline) {
  const tabEngagement = document.getElementById("tab-engagement");
  const tabStory = document.getElementById("tab-story");
  if (!tabEngagement || !tabStory) return;

  function select(which) {
    const showStory = which === "story";
    tabEngagement.classList.toggle("is-active", !showStory);
    tabStory.classList.toggle("is-active", showStory);
    tabEngagement.setAttribute("aria-selected", String(!showStory));
    tabStory.setAttribute("aria-selected", String(showStory));
    gallery.hidden = showStory;
    timeline.hidden = !showStory;
  }

  tabEngagement.addEventListener("click", () => select("engagement"));
  tabStory.addEventListener("click", () => select("story"));
}

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
  const timeline = document.getElementById("timeline");
  const story = gallery?.closest(".story");
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

  if (timeline) {
    for (const entry of TIMELINE) {
      const item = document.createElement("article");
      item.className = "timeline-item";

      const dot = document.createElement("span");
      dot.className = "timeline-dot";
      dot.setAttribute("aria-hidden", "true");
      item.append(dot);

      const img = document.createElement("img");
      img.src = entry.src;
      img.alt = `${entry.caption} — ${entry.date}`;
      img.loading = "lazy";
      img.decoding = "async";
      item.append(img);

      const body = document.createElement("div");
      body.className = "timeline-body";
      const date = document.createElement("p");
      date.className = "timeline-date";
      date.textContent = entry.date;
      const cap = document.createElement("p");
      cap.className = "timeline-caption";
      cap.textContent = entry.caption;
      body.append(date, cap);
      item.append(body);

      timeline.append(item);
    }
  }

  initTabs(gallery, timeline);

  const REGISTRY_URL = "https://www.zola.com/registry/tarifandsonia";

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
  `;
  const intro = document.querySelector(".intro");
  if (intro) {
    intro.after(details);
  } else {
    (story || gallery).append(details);
  }

  const registry = document.createElement("div");
  registry.className = "registry";
  registry.innerHTML = `
    <p class="registry-note">Participating in the registry is entirely optional and not required!</p>
    <a class="registry-button" href="${REGISTRY_URL}" target="_blank" rel="noopener">Wedding Registry</a>`;
  (story || gallery).append(registry);

  const mapFrame = document.createElement("iframe");
  mapFrame.className = "map";
  mapFrame.src = MAPS_EMBED;
  mapFrame.title = "Map to Scottadito Osteria Toscana, 788A Union Street, Brooklyn";
  mapFrame.loading = "lazy";
  mapFrame.referrerPolicy = "no-referrer-when-downgrade";
  mapFrame.allowFullscreen = true;
  (story || gallery).append(mapFrame);

  const APPLE_MAPS_URL =
    "https://maps.apple.com/?q=Scottadito+Osteria+Toscana+788A+Union+Street+Brooklyn+NY+11215&ll=40.6746374,-73.9765659";
  const mapLinks = document.createElement("div");
  mapLinks.className = "map-links";
  mapLinks.innerHTML = `
    <a class="map-link" href="${MAPS_URL}" target="_blank" rel="noopener">Open in Google Maps</a>
    <a class="map-link map-link-outline" href="${APPLE_MAPS_URL}" target="_blank" rel="noopener">Open in Apple Maps</a>`;
  (story || gallery).append(mapLinks);

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
