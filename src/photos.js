import photoUrls from "virtual:photos";

const FINALE_MARK = "06-running";

function decodeName(url) {
  return decodeURIComponent(url);
}

export function getPhotoUrls() {
  return photoUrls;
}

export function getFinaleUrl() {
  return (
    photoUrls.find((url) => decodeName(url).includes(FINALE_MARK)) ||
    photoUrls.at(-1) ||
    null
  );
}

export function getGalleryUrls() {
  const finale = getFinaleUrl();
  return photoUrls.filter((url) => url !== finale);
}
