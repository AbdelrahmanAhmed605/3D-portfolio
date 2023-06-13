import "./style.css";
import * as THREE from "three";

// Create the scene
const scene = new THREE.Scene();

// Create the camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Create the renderer
const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector("#canvas-bg"), // Specify the canvas element for rendering
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Set the initial camera position
camera.position.setZ(30);

// Render the scene with the camera
renderer.render(scene, camera);

// Create the geometry for the torus
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);

// Create the material for the torus
const material = new THREE.MeshBasicMaterial({
  color: 0xff6347,
  wireframe: true,
});

// Create the torus mesh with the geometry and material
const torus = new THREE.Mesh(geometry, material);

// Add the torus to the scene
scene.add(torus);

// Define the animate function for rendering animation
function animate() {
  requestAnimationFrame(animate);

  // Rotate the torus
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  // Render the scene with the updated camera and torus position
  renderer.render(scene, camera);
}

// Start the animation
animate();
