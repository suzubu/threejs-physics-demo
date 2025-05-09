import * as THREE from "three";
import { getBody, getMouseBall } from "./getBodies.js";
import RAPIER from "https://cdn.skypack.dev/@dimforge/rapier3d-compat@0.11.2";
import { EffectComposer } from "jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "jsm/postprocessing/UnrealBloomPass.js";

const w = window.innerWidth;
const h = window.innerHeight;

// Scene setup: create a new Three.js scene to hold all 3D objects
const scene = new THREE.Scene();

// Camera setup: create a perspective camera with a 75-degree field of view,
// aspect ratio based on window size, and near/far clipping planes at 0.1 and 1000
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5; // Position the camera slightly away from the origin

// Renderer setup: initialize WebGL renderer with antialiasing enabled for smoother edges
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h); // Set renderer size to fill the window
document.body.appendChild(renderer.domElement); // Add the renderer canvas to the document

// Vector to track mouse position normalized to [-1, 1] range for both axes
let mousePos = new THREE.Vector2();

// Initialize Rapier physics engine asynchronously before using
await RAPIER.init();

// Define gravity vector for the physics world (no gravity here, all zeros)
const gravity = { x: 0.0, y: 0, z: 0.0 };

// Create a new Rapier physics world with the specified gravity
const world = new RAPIER.World(gravity);

// Post-processing setup using EffectComposer for advanced rendering effects

// RenderPass renders the scene normally before any post-processing
const renderScene = new RenderPass(scene, camera);

// UnrealBloomPass parameters:
// - resolution: size of the rendering buffer
// - strength: intensity of the bloom effect (1.0 here)
// - radius: blur radius for the bloom (0.0 means no additional blur radius)
// - threshold: luminance threshold to trigger bloom (very low at 0.00005 to catch most bright parts)
const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 1.0, 0.0, 0.00005);

// Create the composer and add the passes in order
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

// Create multiple physics bodies and their corresponding meshes, add to scene and physics world
const numBodies = 100;
const bodies = [];
for (let i = 0; i < numBodies; i++) {
  const body = getBody(RAPIER, world);
  bodies.push(body);
  scene.add(body.mesh);
}

// Create a special physics body that follows the mouse position, for interaction
const mouseBall = getMouseBall(RAPIER, world);
scene.add(mouseBall.mesh);

// Add a hemisphere light to illuminate the scene with subtle colors from sky and ground
const hemiLight = new THREE.HemisphereLight(0x00bbff, 0xaa00ff);
hemiLight.intensity = 0.1;
scene.add(hemiLight);

// Main animation loop: updates physics and renders the scene continuously
function animate() {
  requestAnimationFrame(animate);

  // Step the physics simulation forward by one timestep
  world.step();

  // Update the mouseBall's position and interactions based on current mouse position
  mouseBall.update(mousePos);

  // Update each body's mesh position and rotation from physics simulation
  bodies.forEach((b) => b.update());

  // Render the scene with post-processing effects applied
  composer.render(scene, camera);

  // Optionally, could render without post-processing:
  // renderer.render(scene, camera);
}

animate(); // Start the animation loop

// Handle window resizing: update camera aspect ratio and renderer size accordingly
function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", handleWindowResize, false);

// Handle mouse movement: convert screen coordinates to normalized device coordinates [-1, 1]
function handleMouseMove(evt) {
  mousePos.x = (evt.clientX / window.innerWidth) * 2 - 1;
  mousePos.y = -(evt.clientY / window.innerHeight) * 2 + 1;
}
window.addEventListener("mousemove", handleMouseMove, false);
