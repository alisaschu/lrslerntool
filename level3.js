import './style.scss'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

//erzeugt eine Szene, Renderer und Kamera, setze Anzeigegröße
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio( window.devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight);
camera.position.setZ(30);
renderer.render(scene, camera);
//Orbit Controls für debugging
const controls = new OrbitControls(camera, renderer.domElement);

const ambientLight = new THREE.AmbientLight(0x000000);
//scene.add(pointLight, ambientLight);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 5.0);
directionalLight.position.copy(camera.position);
scene.add(directionalLight); 

const hogwartsTexture = new THREE.TextureLoader().load('peves.jpg');
scene.background = hogwartsTexture;

const overlayGeometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight); 
const overlayMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.7 }); // 0xffc0cb
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial);
overlay.position.z = -10;
scene.add(overlay);

let mixer;
const loader = new GLTFLoader();
loader.load( 'models/ghost/scene.gltf', function ( gltf ) {
    gltf.scene.scale.set(0.4, 0.4, 0.4);
/*     gltf.scene.rotation.y = -1.2;
    gltf.scene.position.y = -5;
    gltf.scene.position.x = 25; */

    gltf.scene.position.x = 25;
    gltf.scene.position.y = -5;
    gltf.scene.rotation.y = -1.2;
    mixer = new THREE.AnimationMixer(gltf.scene);
    const clips = gltf.animations;
    const clip = THREE.AnimationClip.findByName(clips, 'Spook_animation');
    const action = mixer.clipAction(clip);
    action.play();
    scene.add( gltf.scene );
  
  }, undefined, function ( error ) {
    
      console.error( error );
  
  } );


const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();


function onPointerMove( event ) {

var rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ( ( event.clientX - rect.left ) / ( rect.width - rect.left ) ) * 2 - 1;
    pointer.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;
}

window.addEventListener( 'mousemove', onPointerMove );

const letters = document.querySelectorAll('.word-letter');
var falseFound = false;
var selectedLetters = [];
letters.forEach(letter => {
  letter.addEventListener('click', function() {
    if (letter.style.textDecoration.includes("line-through")) {
      letter.style.textDecoration = "none";
       
      const index = selectedLetters.indexOf(letter.textContent);
      if (index !== -1) {
        selectedLetters.splice(index, 1);
      }
    } else {
      selectedLetters.push(letter.textContent);
      letter.style.textDecoration = "line-through #d30808 5px";
    }
  });
});

const letterOptions = document.querySelectorAll('.letters');
var rightFound = false;
letterOptions.forEach(letter => {
  letter.addEventListener('click', function() {
    if (letter.classList.contains('active')) {
      letter.classList.remove('active'); 
      rightFound = false;
    } else {
      letterOptions.forEach(item => {
        item.classList.remove('active');
        rightFound = false;
      });
      letter.classList.add('active'); 
      if (letter.textContent == "e") {
        rightFound = true;
      }
    }
  });
});


function checkAnswer() {
  const infoAnswerDiv = document.querySelector('.info-answer');
  var existingStrong = infoAnswerDiv.querySelector('strong');
  if (!existingStrong) {
    existingStrong = document.createElement('strong');
    infoAnswerDiv.appendChild(existingStrong);
  }
  if (selectedLetters.length == 1 && selectedLetters[0] == "a" && rightFound == true ) {
    existingStrong.innerHTML = "Richtige Antwort! <br> Super, du hast alle Aufgaben gelöst!";

  } else {
    existingStrong.textContent = "Versuchs nochmal";
  }
}

document.querySelector('.check-answer').addEventListener('click', checkAnswer);

const clock = new THREE.Clock();
function animate() {
    if(mixer)
      mixer.update(clock.getDelta());
    requestAnimationFrame(animate);


    renderer.render(scene, camera);
  }
  
  animate();