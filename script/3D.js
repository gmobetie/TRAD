import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const div = document.getElementById("render");
div.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1D1A1B);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
if (window.innerWidth > 1024) {
  camera.position.set(0, 2, 6);
} else {
  camera.position.set(0, 2, 10);
}

const spotLight = new THREE.SpotLight(0xffffff, 3, 100, 0.22, 1);
spotLight.position.set(0, 25, 10);
spotLight.castShadow = true;
spotLight.shadow.bias = -0.0001;
scene.add(spotLight);

const loader = new GLTFLoader().setPath("assets/");
let root;
loader.load("megaphone.glb", (gltf) => {
  gltf.scene.scale.set(0.1, 0.1, 0.1);
  root = gltf.scene;
  scene.add(root);
});
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  
});

let rotation = 0.002;
//on scroll rotation of the megaphone
window.addEventListener("wheel", (event) => {
  rotation = event.deltaY * 0.0002;
});

window.addEventListener("click", (event) => {
  rotation = 0.002;
});

function animate() {
  requestAnimationFrame(animate);
  if (root) {
    root.rotation.y += rotation;
  }
  renderer.render(scene, camera);
}

animate();

//audio 

const c = document.getElementById("audioPlay");

let opt ={
  width: c.offsetWidth,
  height: c.offsetHeight,
  midY: c.offsetHeight / 2,
  points: 80,
  stretch: 10,
  sinHeight: 0,
  speed:-0.1,
  strokeColor: "black",
  strokeWidth: 3,

};

c.width = opt.width*2;
c.height = opt.height*2;
c.style.width = opt.width;
c.style.height = opt.height;

const ctx = c.getContext("2d");
ctx.scale(2, 2);
ctx.strokeStyle = opt.strokeColor;
ctx.lineWidth = opt.strokeWidth;
ctx.lineCap = "round";
ctx.lineJoin = "round";

let time = 0;

const render = () => {
  window.requestAnimationFrame(render);
  ctx.clearRect(0,0,opt.width,opt.height);
  time += 1;
  ctx.beginPath();
  let increment = 0;
  for (let i = 0; i < opt.points; i++) {
   if(i<opt.points/2){
    increment += 0.1;
    }
    else{
      increment += -0.1;
    }
    const x = (opt.width / opt.points) * i;
    const y = opt.midY + Math.sin(time * opt.speed + i / opt.stretch) * opt.sinHeight * increment;
    ctx.lineTo(x, y);
  }
  ctx.stroke();
};
render();

const cursor = document.querySelector(".cursor");
const round = document.querySelector(".ring div");
const ring = document.querySelector(".ring");

var music = new Howl({
  src: ["assets/sound/musique.mp3"],
  volume: 0.5,
  loop: true,
});

c.addEventListener("mouseover", () => {
   TweenMax.to(opt, 1, {
    sinHeight: 15,
    strech: 5,
    ease: Power2.easeInOut,
    });
    cursor.classList.add("play");
    round.innerHTML = "Play !";
    music.play();



});

c.addEventListener("mouseout", () => {
  TweenMax.to(opt, 1, {
    sinHeight: 0,
    strech: 10,
    ease: Power3.easeOut,
    });

    cursor.classList.remove("play");
    round.innerHTML = "";
    music.stop();
}
);



window.addEventListener("mousemove", (e) => {
  let sizeW = ring.offsetWidth / 2;
  let sizeH = ring.offsetWidth / 2;
  ring.style.transform = `translateX(calc(${e.clientX}px - ${sizeW}px)) translateY(calc(${e.clientY}px - ${sizeH}px))`;
});


