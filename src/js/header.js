import '../styles/index.scss';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import spark from '../assets/textures/spark_06_rotated.png';
import leaf from '../assets/textures/why.gltf'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { BlendingEquation } from 'three';

// LOADER
const loader = new THREE.TextureLoader();
const circle = loader.load(spark);


// Models 

const gltfLoader = new GLTFLoader()
gltfLoader.load(
    leaf,
    (gltf) => 
    {
        gltf.scene.position.set(0, -1, 0)
        scene.add(gltf.scene)
    }
)
// Debug
// const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// const fog = new THREE.Fog('#003f0f', 1, 3);
// scene.fog = fog

// Objects
const geometry = new THREE.TorusGeometry(0.7, 0.2, 16, 100);

const particlesGeometry = new THREE.BufferGeometry();
const particlesCnt = 3000;

const posArray = new Float32Array(particlesCnt * 3);

for (let i = 0; i < particlesCnt * 3; i++) {
  // posArray[i] = Math.random()
  // posArray[i] = Math.random() - 0.5
  posArray[i] = (Math.random() - 0.5) * (Math.random() * 5);
}

particlesGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(posArray, 3)
);

// Materials

const material = new THREE.PointsMaterial({
  size: 0.008,
});

const particlesMaterial = new THREE.PointsMaterial({
  size: 0.015,
  map: circle,
  transparent: true,
  blending: THREE.AdditiveBlending,
  color: '#00ff3a'
});

// Mesh
const sphere = new THREE.Points(geometry, material);
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Lights

const pointLight = new THREE.PointLight(0x00ff3a, 2);
pointLight.position.x = 1;
pointLight.position.y = 0;
pointLight.position.z = 1;
scene.add(pointLight);

// const pointLightHelper = new THREE.PointLightHelper ( pointLight)
// scene.add(pointLightHelper)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(new THREE.Color('#121212'), 1);

// Mouse

document.addEventListener('mousemove', animateParticles);

let mouseX = 0;
let mouseY = 0;

function animateParticles(event) {
  mouseY = event.clientY;
  mouseX = event.clientX;
}

/**
 * Animate
 */

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  particlesMesh.rotation.y = -0.1 * elapsedTime;

  // Update objects
//   sphere.rotation.y = 0.5 * elapsedTime;

//   if (mouseX > 0) {
//     particlesMesh.rotation.x = -mouseY * (elapsedTime * 0.00008);
//     particlesMesh.rotation.y = -mouseX * (elapsedTime * 0.00008);
//   }

  // Update Orbital Controls
  // controls.update()

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
