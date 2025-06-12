import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as THREE from "three";
import { DRACOLoader, GLTFLoader, Timer } from "three/examples/jsm/Addons.js";

// set up loaders

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

// set up canvas

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

const [width, height] = [
  (canvas.width = window.innerWidth),
  (canvas.height = window.innerHeight),
];

// set up scene

const scene = new THREE.Scene();

// set up objects

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(4, 4),
  new THREE.MeshStandardMaterial({
    color: 0x808080,
    roughness: 0.5,
    metalness: 0.1,
  })
);

floor.rotation.x = -Math.PI / 2;

scene.add(floor);

// adding a model

let hamburger: THREE.Object3D | null = null;

gltfLoader.load("models/hamburger/hamburger.gltf", (gltf) => {
  gltf.scene.scale.setScalar(0.1);
  gltf.scene.position.set(0, 0.1, 0);

  hamburger = gltf.scene;
  scene.add(hamburger);
});

// set up axes helper

const axesHelper = new THREE.AxesHelper(0.1);
scene.add(axesHelper);

// set up camera

const camera = new THREE.PerspectiveCamera(75, width / height);
camera.position.set(1, 1, 2);

scene.add(camera);

// set up orbit controls

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// set up renderer

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// set up the lights

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
const ambientLight = new THREE.AmbientLight(0x404040, 6);

directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight, ambientLight);

// Animation loop

const timer = new Timer();

const tick = () => {
  timer.update();
  const elapsedTime = timer.getElapsed();
  // const deltaTime = timer.getDelta();

  // update controls to enable damping
  controls.update();

  // rotate the hamburger model if it exists

  if (hamburger) {
    hamburger.rotation.y = elapsedTime * 0.5; 
  }

  // render
  renderer.render(scene, camera);

  // request next frame
  window.requestAnimationFrame(tick);
};

tick();

// Handle window resize

function handleResize() {
  const visualViewport = window.visualViewport!;
  const width = visualViewport.width;
  const height = visualViewport.height;

  canvas.width = width;
  canvas.height = height;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

// Usar el evento 'resize' de visualViewport para móviles
if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", handleResize);
} else {
  window.addEventListener("resize", handleResize);
}
