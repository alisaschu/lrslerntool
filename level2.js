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

const hogwartsTexture = new THREE.TextureLoader().load('forest.jpg');
scene.background = hogwartsTexture;

const overlayGeometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight); 
const overlayMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.7 }); // 0xffc0cb
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial);
overlay.position.z = -10;
scene.add(overlay);

let mixer, mixer2;
const loader = new GLTFLoader();
loader.load( 'models/dragon/scene.gltf', function ( gltf ) {
    gltf.scene.scale.set(900, 900, 900);
    gltf.scene.rotation.y = -1.2;
    gltf.scene.position.y = -5;
    gltf.scene.position.x = 25;

    mixer = new THREE.AnimationMixer(gltf.scene);
    mixer2 = new THREE.AnimationMixer(gltf.scene);
    const clips = gltf.animations;
    const clip = THREE.AnimationClip.findByName(clips, 'Dargon_anyingxunlong_anim_stand');
    const clip2 = THREE.AnimationClip.findByName(clips, 'Dargon_anyingxunlong_anim_death');
    const action = mixer.clipAction(clip);
    const action2 = mixer2.clipAction(clip2);
    action.play();
    action2.setLoop(THREE.LoopOnce);
    action2.clampWhenFinished = true;
    action2.play();
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

const dropTarget = document.getElementById("drop-target");
const letters = document.querySelectorAll('.letters');

dropTarget.addEventListener("dragover", function (event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
});

dropTarget.addEventListener("drop", function (event) {
    event.preventDefault();
    if (this.querySelector('p').textContent != ' ') {
        const input = this.querySelector('p').textContent;
        returnDropped(input);
    }
    const letterText = event.dataTransfer.getData('text/plain');
    this.querySelector('p').textContent = letterText;
    hideDropped(letterText);
});

var rightAnswer = false;

function hideDropped(letterText) {
    var listObj;
    switch (letterText) {
      case "e":
        listObj = document.getElementsByClassName("e-letter");
        listObj[0].style.display = "none";
        rightAnswer = true;
        break;
      case "a":
        listObj = document.getElementsByClassName("a-letter");
        listObj[0].style.display = "none";
        rightAnswer = false;
        break;
      case "i":
        listObj = document.getElementsByClassName("i-letter");
        listObj[0].style.display = "none";
        rightAnswer = false;
        break;
      case "ou":
        listObj = document.getElementsByClassName("ou-letter");
        listObj[0].style.display = "none";
        rightAnswer = false;
        break;
    }
}

function returnDropped(letterText) {
    var listObj;
    switch (letterText) {
      case "e":
        listObj = document.getElementsByClassName("e-letter");
        listObj[0].style.display = "block";
        break;
      case "a":
        listObj = document.getElementsByClassName("a-letter");
        listObj[0].style.display = "block";
        break;
      case "i":
        listObj = document.getElementsByClassName("i-letter");
        listObj[0].style.display = "block";
        break;
      case "ou":
        listObj = document.getElementsByClassName("ou-letter");
        listObj[0].style.display = "block";
        break;
    }
}

letters.forEach(letter => {
    letter.addEventListener('dragstart', function(event) {
        event.dataTransfer.setData('text/plain', this.textContent);
    });
});

var checkAnswerButton = false;
function checkAnswer() {
  const infoAnswerDiv = document.querySelector('.info-answer');
  var existingStrong = infoAnswerDiv.querySelector('strong');
  if (!existingStrong) {
    existingStrong = document.createElement('strong');
    infoAnswerDiv.appendChild(existingStrong);
  }

  if (rightAnswer) {
    existingStrong.textContent = "Richtige Antwort";
    checkAnswerButton = true;
    wellDone();
  } else {
    existingStrong.textContent = "Versuchs nochmal";
  }
    
}

function wellDone() {
  const infoAnswerDiv = document.querySelector('.lev2');
  var existingStrong = document.createElement('strong');
  existingStrong.innerHTML = "Super gemacht! Du hast den Drachen mit einem Schlafzauber belegt. <br>Jetzt aber schnell weg, bevor er wieder aufwacht!";
  infoAnswerDiv.appendChild(existingStrong);
  var button = document.querySelector('.lev1');
  button.style.display = "inline-block";
}

document.querySelector('.check-answer').addEventListener('click', checkAnswer);
const clock = new THREE.Clock();
function animate() {
    if(mixer && !checkAnswerButton)
      mixer.update(clock.getDelta());
    if(mixer2 && rightAnswer && checkAnswerButton)
      mixer2.update(clock.getDelta());
    requestAnimationFrame(animate);


    renderer.render(scene, camera);
  }
  
  animate();