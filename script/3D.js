import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const div = document.getElementById('render');
div.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 2, 7);

const spotLight = new THREE.SpotLight(0xffffff,  3, 100, 0.22, 1);
spotLight.position.set(0, 25, 10);
spotLight.castShadow = true;
spotLight.shadow.bias = -0.0001;
scene.add(spotLight);

const loader = new GLTFLoader().setPath('assets/');
let root;
loader.load('megaphone.glb', (gltf) => {
   
    gltf.scene.scale.set(0.1, 0.1, 0.1); 
    root = gltf.scene;
    scene.add(root);

});
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  if (root) {
    root.rotation.y += 0.01;
}
  renderer.render(scene, camera);
}

animate();