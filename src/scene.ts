import "./style.css";

import * as THREE from "three";
import { createCamera } from "./camera.ts";
import { COLORS, WINDOW_HEIGHT, WINDOW_WIDTH } from "./globals.ts";

export type Scene = {
  start: () => void;
  stop: () => void;
  onMouseDown: (event: MouseEvent) => void;
  onMouseUp: (event: MouseEvent) => void;
  onMouseMove: (event: MouseEvent) => void;
};

export function createScene(): Scene {
  const scene = new THREE.Scene();
  const camera = createCamera();
  const renderer = new THREE.WebGLRenderer();

  renderer.setSize(WINDOW_WIDTH, WINDOW_HEIGHT);
  renderer.setClearColor(COLORS.SKY);
  document.body.appendChild(renderer.domElement);

  const tileGeometry = new THREE.BoxGeometry(1, 1, 1);
  const grassMaterial = new THREE.MeshBasicMaterial({ color: COLORS.GRASS });
  const mesh = new THREE.Mesh(tileGeometry, grassMaterial);

  scene.add(mesh);

  const draw = () => {
    renderer.render(scene, camera.camera);
  };

  const start = () => {
    renderer.setAnimationLoop(draw);
  };

  const stop = () => {
    renderer.setAnimationLoop(null);
  };

  window.addEventListener("resize", () => {
    camera.camera.aspect = WINDOW_WIDTH / WINDOW_HEIGHT;
    camera.camera.updateProjectionMatrix();
    renderer.setSize(WINDOW_WIDTH, WINDOW_HEIGHT);
  });

  return {
    start,
    stop,
    onMouseDown: camera.onMouseDown,
    onMouseUp: camera.onMouseUp,
    onMouseMove: camera.onMouseMove,
  };
}

declare global {
  interface Window {
    scene: Scene;
  }
}

window.onload = () => {
  window.scene = createScene();
  document.addEventListener("mousedown", window.scene.onMouseDown);
  document.addEventListener("mouseup", window.scene.onMouseUp);
  document.addEventListener("mousemove", window.scene.onMouseMove);
  window.scene.start();
};

document.addEventListener("contextmenu", (e) => e.preventDefault());
