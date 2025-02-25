import * as THREE from "three";
import {
  CAMERA_FOV,
  DEGREE_TO_RADIUS,
  LEFT_MOUSE_BUTTON,
  MAX_CAMERA_ELEVATION,
  MAX_CAMERA_RADIUS,
  MIDDLE_MOUSE_BUTTON,
  MIN_CAMERA_ELEVATION,
  MIN_CAMERA_RADIUS,
  PAN_SENSITIVITY,
  RIGHT_MOUSE_BUTTON,
  ROTATION_SENSITIVITY,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
  Y_AXIS,
  ZOOM_SENSITIVITY,
} from "./globals.js";

export function createCamera() {
  const camera = new THREE.PerspectiveCamera(
    CAMERA_FOV,
    WINDOW_WIDTH / WINDOW_HEIGHT,
    0.1,
    1000
  );

  let cameraOrigin = new THREE.Vector3();
  let cameraRadius = 10;
  let cameraAzimuth = 0;
  let cameraElevation = 0;

  let isLeftMouseDown = false;
  let isRightMouseDown = false;
  let isMiddleMouseDown = false;

  let prevMouseX = 0;
  let prevMouseY = 0;

  const updateCameraPosition = () => {
    camera.position.x =
      cameraRadius *
      Math.sin(cameraAzimuth * DEGREE_TO_RADIUS) *
      Math.cos(cameraElevation * DEGREE_TO_RADIUS);
    camera.position.y =
      cameraRadius * Math.sin(cameraElevation * DEGREE_TO_RADIUS);
    camera.position.z =
      cameraRadius *
      Math.cos(cameraAzimuth * DEGREE_TO_RADIUS) *
      Math.cos(cameraElevation * DEGREE_TO_RADIUS);
    camera.position.add(cameraOrigin);
    camera.lookAt(cameraOrigin);
    camera.updateMatrix();
  };

  const onMouseDown = (event: MouseEvent) => {
    console.log("mousedown");

    if (event.button === LEFT_MOUSE_BUTTON) {
      isLeftMouseDown = true;
    }
    if (event.button === MIDDLE_MOUSE_BUTTON) {
      isMiddleMouseDown = true;
    }
    if (event.button === RIGHT_MOUSE_BUTTON) {
      isRightMouseDown = true;
    }
  };

  const onMouseUp = (event: MouseEvent) => {
    console.log("mouseup");

    if (event.button === LEFT_MOUSE_BUTTON) {
      isLeftMouseDown = false;
    }
    if (event.button === MIDDLE_MOUSE_BUTTON) {
      isMiddleMouseDown = false;
    }
    if (event.button === RIGHT_MOUSE_BUTTON) {
      isRightMouseDown = false;
    }
  };

  const onMouseMove = (event: MouseEvent) => {
    console.log("mousemove");

    const deltaX = event.clientX - prevMouseX;
    const deltaY = event.clientY - prevMouseY;

    if (isLeftMouseDown) {
      cameraAzimuth += -(deltaX * ROTATION_SENSITIVITY);
      cameraElevation += deltaY * ROTATION_SENSITIVITY;
      cameraElevation = Math.min(
        MAX_CAMERA_ELEVATION,
        Math.max(MIN_CAMERA_ELEVATION, cameraElevation)
      );
      updateCameraPosition();
    }

    if (isMiddleMouseDown) {
      const forward = new THREE.Vector3(0, 0, 1).applyAxisAngle(
        Y_AXIS,
        cameraAzimuth * DEGREE_TO_RADIUS
      );
      const left = new THREE.Vector3(1, 0, 0).applyAxisAngle(
        Y_AXIS,
        cameraAzimuth * DEGREE_TO_RADIUS
      );
      cameraOrigin.add(forward.multiplyScalar(PAN_SENSITIVITY * deltaY));
      cameraOrigin.add(left.multiplyScalar(PAN_SENSITIVITY * deltaX));
      updateCameraPosition();
    }

    if (isRightMouseDown) {
      cameraRadius += deltaY * ZOOM_SENSITIVITY;
      cameraRadius = Math.min(
        MAX_CAMERA_RADIUS,
        Math.max(MIN_CAMERA_RADIUS, cameraRadius)
      );
      updateCameraPosition();
    }

    prevMouseX = event.clientX;
    prevMouseY = event.clientY;
  };

  updateCameraPosition();

  return {
    camera,
    onMouseDown,
    onMouseUp,
    onMouseMove,
  };
}
