import * as THREE from "three";

/*** GLOBAL VARS ***/

const windowW = window.innerWidth;
const windowH = window.innerHeight;

const colors = {
  sky: 0x87ceeb,
  grass: 0x4caf50,
};

/*** SCENE ***/

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, windowW / windowH, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(windowW, windowH);
renderer.setClearColor(colors.sky);
document.body.appendChild(renderer.domElement);

camera.position.set(10, 10, 10);
camera.lookAt(0, 0, 0);

const tileGeometry = new THREE.BoxGeometry(1, 1, 1);
const grassMaterial = new THREE.MeshBasicMaterial({ color: colors.grass });
const mesh = new THREE.Mesh(tileGeometry, grassMaterial);

scene.add(mesh);

/*** METHODS ***/

const drawScene = () => {
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.01;
  renderer.render(scene, camera);
};

const startAnimation = () => {
  renderer.setAnimationLoop(drawScene);
};
const stopAnimation = () => {
  renderer.setAnimationLoop(null);
};

const onMouseDown = () => console.log("mousedown");
const onMouseUp = () => console.log("mouseup");
const onMouseMove = () => console.log("mousemove");

/*** WINDOW ***/

window.onload = () => {
  startAnimation();
};

window.addEventListener("resize", () => {
  camera.aspect = windowW / windowH;
  camera.updateProjectionMatrix();
  renderer.setSize(windowW, windowH);
});

window.addEventListener("mousedown", onMouseDown);
window.addEventListener("mouseup", onMouseUp);
window.addEventListener("mousemove", onMouseMove);
