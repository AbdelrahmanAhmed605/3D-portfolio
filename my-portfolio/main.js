import './style.css'
import * as THREE from 'three';
import gsap from 'gsap';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


const start = document.querySelector(".start");
var starter = false;
const fbxLoader = new FBXLoader();
const modelPathSky = './3dsky.fbx';
const modelPathBoard = './whiteBoard.fbx';


// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000)

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// Camera - FOV, aspect ratio, near and far
const camera = new THREE.PerspectiveCamera(45, sizes.width/sizes.height, 0.1, 100)
camera.position.setZ(20);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#main-content")
})

renderer.setPixelRatio(2);
renderer.setSize(sizes.width, sizes.height);

// Resize
window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  // Scene is rendering only once during resize, so we need to re-render the canvas
  renderer.setSize(sizes.width, sizes.height);
})


// Light
const pointLight = new THREE.PointLight(0xbf40BF);
pointLight.position.set(5, -28.5, 5);

const pointLight2 = new THREE.PointLight(0x00ffff);
pointLight2.position.set(5, 5, 5);

scene.add(pointLight, pointLight2);


// Geometry
const crystalGeometry = new THREE.OctahedronGeometry(1, 0)

// const whiteBasicMaterial = new THREE.MeshBasicMaterial({color: 0xffff})
const whiteMaterial = new THREE.MeshStandardMaterial({color: 0xffff})

const shinyMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  metalness: 0.1,
  roughness: 0.2,
  shininess: 0.9,
  transparent: true,
  opacity: 0.7
})

const crystal = new THREE.Mesh(crystalGeometry, shinyMaterial)
const crystal2 = crystal.clone();
crystal.position.set(12, 0, -2)
crystal2.position.set(-10, 0, 2);

scene.add(crystal, crystal2);

// Creating different meshes in random positions whenever user refreshes
const createMeshWithRandomPosition = (geometry, material) => {
  const mesh = new THREE.Mesh(geometry, material);

  // Creating random numbers between -170 and 170
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(170))
  mesh.position.set(x, y, z);

  scene.add(mesh);
}

// Creating empty array with 50 elements and filling it by mapping it with createMeshWithRandomPosition function
Array(50).fill().map(() => createMeshWithRandomPosition(crystalGeometry, whiteMaterial))

// For the sphere/donuts
Array(50).fill().map(() => createMeshWithRandomPosition(new THREE.SphereGeometry(0.3, 20, 20), whiteMaterial))

const createMeshWithRandomPositionAndRotation = (geometry, material) => {
  const mesh = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(170))
  mesh.position.set(x, y, z);

  const [rx, ry, rz] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(1))
  mesh.rotation.set(rx, ry, rz);

  scene.add(mesh);
}

Array(50).fill().map(() => createMeshWithRandomPositionAndRotation(new THREE.TorusGeometry( 2, 1, 16, 100), shinyMaterial))

// Textures on the sphere
const textureLoader = new THREE.TextureLoader();
const normalTexture = textureLoader.load('./normal-map.jpg')

const texturedMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  metalness: 0.1,
  roughness: 0.2,
  normalMap: normalTexture,
  emissive: 0x9152cc
})

const bigSphereGeometry = new THREE.SphereGeometry(5, 64, 64);
const bigSphere = new THREE.Mesh(bigSphereGeometry, texturedMaterial);
scene.add(bigSphere);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);

// Animate the sphere and main crystals through y rotation
const animatedMeshes = [crystal, crystal2, bigSphere]

function animate() {
  requestAnimationFrame(animate);
  animatedMeshes.map(mesh => mesh.rotation.y += 0.005);
  controls.update(); // Update the controls
  renderer.render(scene, camera);
}
animate();



const moveCamera = () => {
  const t = document.body.getBoundingClientRect().top;
  camera.position.z = t * 0.008 + 20;
  camera.position.y = t * 0.008;
  camera.position.x = t * 0.00095;
}

document.body.onscroll = moveCamera


// Start button
start.addEventListener("click", function() {
if(!gsap.isTweening(camera.position)) {
  gsap.to(camera.position, {
    duration: 2,
    z: 5,
    ease: "power1.inOut",
    onComplete: function() {
      scene.background = new THREE.Color(0x8E7CC3)
       const ambientLight = new THREE.AmbientLight(0xffffff);
      ambientLight.intensity = 1; // Adjust the intensity as needed
      scene.add(ambientLight);

      // const worldPointLight = new THREE.PointLight(0xE69138);
      // worldPointLight.position.set(5, 5, 5);
    
      // scene.add(worldPointLight)

      scene.remove(bigSphere)
    }
  })

  starter = !starter;
  start.style.display = "none"; 
  }

  enterPlanet();
})


const enterPlanet = function () {
  fbxLoader.load(modelPathSky, function(model) {
    model.scale.set(4, 4, 4);

    model.rotation.y = Math.PI;
     // Center the model
     model.position.set(0, -3, 0);
    scene.add(model);
  });

  fbxLoader.load(modelPathBoard, function(model) {
    model.scale.set(2, 2, 2);

     // Center the model
     model.position.set(0, -3, 0.1);
    scene.add(model);
  });
}
