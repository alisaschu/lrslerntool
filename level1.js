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
var audio = new Audio('/sounds/glasses.mp3');
var audio2 = new Audio('/sounds/paper.mp3');
var audio3 = new Audio('/sounds/clothes.mp3');
var audio4 = new Audio('/sounds/schwa.mp3');
//Orbit Controls für debugging
const controls = new OrbitControls(camera, renderer.domElement);

const overlayGeometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight); // Größe der Ebene (kann angepasst werden)
const overlayMaterial = new THREE.MeshPhysicalMaterial({ color: 0x000000}); // Farbe, Transparenz 0xffc0cb
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial);

overlay.position.z = -5;
overlay.castShadow = false;
overlay.receiveShadow = true;
scene.add(overlay);

const ambientLight = new THREE.AmbientLight(0xffffff);
//scene.add(pointLight, ambientLight);
//scene.add(ambientLight);

const hogwartsTexture = new THREE.TextureLoader().load('hogwarts.png');
//scene.background = hogwartsTexture;

const levelObjects = [];
const gPosition = new THREE.Vector3();
var glassesFound = false;
var paperFound = false;
var clothesFound = false;

const loader = new GLTFLoader();
loader.load( 'models/glasses/scene.gltf', function ( gltf ) {
    gltf.scene.scale.set(2, 2, 2);
  //  gltf.scene.rotation.y = 0.7;
    gltf.scene.position.y = -15;
    gltf.scene.position.x = -25;
  //  gltf.scene.scale.set(5, 5, 5);
  levelObjects.push(gltf.scene);
  gltf.scene.traverse(function (child) {
    if (child instanceof THREE.Mesh) {
       child.userData.type = 'glasses'; 
    }
  });
    gPosition.copy(gltf.scene.position);
    scene.add( gltf.scene );
  
  }, undefined, function ( error ) {
    
      console.error( error );
  
  } );

  loader.load( 'models/paper/scene.gltf', function ( gltf ) {
    gltf.scene.scale.set(220, 220, 220);
/*   //  gltf.scene.rotation.y = 0.7;
    gltf.scene.position.y = -15;
    gltf.scene.position.x = -25; */
  //  gltf.scene.scale.set(5, 5, 5);
 // gltf.scene.rotation.x = 1;
  gltf.scene.rotation.x = 1;
  gltf.scene.position.y = -26;
  gltf.scene.position.x = 15;
  gltf.scene.position.z = -20;

  levelObjects.push(gltf.scene);
  gltf.scene.traverse(function (child) {
    if (child instanceof THREE.Mesh) {
       child.userData.type = 'paper'; 
    }
  });
    gPosition.copy(gltf.scene.position);
    scene.add( gltf.scene );
  
  }, undefined, function ( error ) {
    
      console.error( error );
  
  } );

  loader.load( 'models/clothes/scene.gltf', function ( gltf ) {
    gltf.scene.scale.set(0.25, 0.25, 0.25);
    gltf.scene.rotation.y = 0.5;
    gltf.scene.rotation.x = 1;
 //   gltf.scene.rotation.z = 1;
    gltf.scene.position.x = 15;
    gltf.scene.position.z = 2;
    gltf.scene.position.y = 5;
 //   gltf.scene.position.z = 20;
  //  gltf.scene.scale.set(5, 5, 5);
  levelObjects.push(gltf.scene);
  gltf.scene.traverse(function (child) {
    if (child instanceof THREE.Mesh) {
       child.userData.type = 'clothes'; 
    }
  });
    gPosition.copy(gltf.scene.position);
    scene.add( gltf.scene );
  
  }, undefined, function ( error ) {
    
      console.error( error );
  
  } );

const pointer = new THREE.Vector2();
const intersectionPoint = new THREE.Vector3();
const planeNormal = new THREE.Vector3();
const plane = new THREE.Plane();
const raycaster = new THREE.Raycaster();
const pointerIntersection = new THREE.Vector2();

const spotLight = new THREE.SpotLight(0xffffff, 0);
scene.add(spotLight);

function onPointerMove( event ) {

  var rect = renderer.domElement.getBoundingClientRect();
  pointerIntersection.x = ( ( event.clientX - rect.left ) / ( rect.width - rect.left ) ) * 2 - 1;
  pointerIntersection.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;

//var rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ( event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - ( event.clientY / window.innerHeight) * 2 + 1;
    
    planeNormal.copy(camera.position).normalize();
    plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
    raycaster.setFromCamera(pointer, camera);
    raycaster.ray.intersectPlane(plane, intersectionPoint);

    spotLight.decay = 0;
    spotLight.position.z = 15;
    spotLight.intensity = 15;
    spotLight.angle = Math.PI / 12;
    spotLight.penumbra = 1;
    spotLight.distance = 50; 
    
      spotLight.position.copy( intersectionPoint);
      spotLight.position.x = intersectionPoint.x;
      spotLight.position.y = intersectionPoint.y;
      spotLight.position.z = 30;
      spotLight.target.position.copy( intersectionPoint );
      spotLight.target.position.x = intersectionPoint.x;
      spotLight.target.position.y = intersectionPoint.y;
      spotLight.target.position.z = 29;
      const spotLightHelper = new THREE.SpotLightHelper(spotLight);
      const intersects = raycaster.intersectObjects( levelObjects );
      if ( intersects.length > 0 ) {
        const selectedObject = intersects[0].object;
        if (selectedObject.userData.type === 'glasses') { 
          if (glassesFound == false) {
            console.log("Glasses found");
            const listObj = document.getElementsByClassName("glasses");
            listObj[0].style.color = "green";
            glassesFound = true;
            wellDone();
          }
        } else if (selectedObject.userData.type === 'paper') {
          if (paperFound == false) {
            console.log("Paper found");
            const listObj = document.getElementsByClassName("paper");
            listObj[0].style.color = "green";
            paperFound = true;
            wellDone();
          }
        } else if (selectedObject.userData.type === 'clothes') {
          if (clothesFound == false) {
            console.log("Clothes found");
            const listObj = document.getElementsByClassName("clothes");
            listObj[0].style.color = "green";
            clothesFound = true;
            wellDone();
          }
        }
      }
} 

window.addEventListener( 'mousemove', onPointerMove );

window.addEventListener('click', function(e) { 
  const intersects = raycaster.intersectObjects( levelObjects );
      if ( intersects.length > 0 ) {
        const selectedObject = intersects[0].object;
        if (selectedObject.userData.type === 'glasses') {
          audio.play();
        } else if (selectedObject.userData.type === 'paper') {
          audio2.play();
        } else if (selectedObject.userData.type === 'clothes') {
            audio3.play();
        }
      } 
});

function playSchwa() {
  audio4.play();
}

document.querySelector('.schwa-laut').addEventListener('click', playSchwa);

function wellDone() {
  if (glassesFound && paperFound && clothesFound) {
    const infoAnswerDiv = document.querySelector('.info-answer');
    var existingStrong = document.createElement('strong');
    existingStrong.textContent = "Super gemacht! Du hast alle Gegenstände gefunden und Harry kommt pünktlich nach Hogwarts!";
    infoAnswerDiv.appendChild(existingStrong);
    var button = document.querySelector('.check-answer');
    button.style.display = "inline-block";
    }
}


function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
  }
  
  animate();