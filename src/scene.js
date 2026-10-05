import * as THREE from "three";

const SKY = 0x87b7d8;
const COVER_URL = "/cover.jpg";
const COVER_DISTANCE = 14;

export function createScene(canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: "low-power",
  });
  renderer.setClearColor(SKY, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80);
  camera.position.set(0, 0, 8.2);

  canvas.style.visibility = "hidden";

  const cover = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ color: SKY })
  );
  cover.position.z = -COVER_DISTANCE;
  scene.add(cover);

  function size() {
    const { width, height } = canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(width));
    const h = Math.max(1, Math.round(height));
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    const vFov = (camera.fov * Math.PI) / 180;
    const viewH = 2 * Math.tan(vFov / 2) * COVER_DISTANCE;
    const viewW = viewH * camera.aspect;
    const texture = cover.material.map;
    let planeW = viewW;
    let planeH = viewH;
    if (texture?.image?.width && texture.image.height) {
      const imageAspect = texture.image.width / texture.image.height;
      const viewAspect = viewW / viewH;
      if (imageAspect > viewAspect) {
        planeH = viewH;
        planeW = planeH * imageAspect;
      } else {
        planeW = viewW;
        planeH = planeW / imageAspect;
      }
    }
    cover.scale.set(planeW, planeH, 1);
    renderer.render(scene, camera);
  }

  new THREE.TextureLoader().load(COVER_URL, (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    cover.material.map = texture;
    cover.material.color.set(0xffffff);
    cover.material.needsUpdate = true;
    size();
    canvas.style.visibility = "visible";
  });

  window.addEventListener("resize", size, { passive: true });
  size();

  return () => {
    window.removeEventListener("resize", size);
    renderer.dispose();
  };
}
