/* 
Code Quellen: 
https://threejs.org/docs/
https://discoverthreejs.com/ 
https://www.youtube.com/watch?v=Q7AOvWpIVHU
https://www.youtube.com/watch?v=ohEtw-F1FR8&t=344s
https://www.youtube.com/watch?v=SE1HXc2V3Xk



*/

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

// Variablen
let snitch = null;
let traveler = null;
let mixer, mixer2, mixer3; 

const viewSize = {
  width: window.screen.width,
  height: window.screen.height
};

// Background und Licht
const hogwartsTexture = new THREE.TextureLoader().load('hogwarts.jpg');
scene.background = hogwartsTexture;
const overlayGeometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight); // Größe der Ebene (kann angepasst werden)
const overlayMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.5 }); // Farbe, Transparenz
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial);
overlay.position.z = -30;
scene.add(overlay);

const pointLight = new THREE.PointLight(0xffffff, 100, 100 );
pointLight.position.set(1,10,2);
scene.add( pointLight );

const ambientLight = new THREE.AmbientLight(0xffffff);
//scene.add(pointLight, ambientLight);
scene.add(ambientLight);

const pointLightHelper = new THREE.PointLightHelper( pointLight, 1 );
//scene.add( pointLightHelper );

const directionalLight = new THREE.DirectionalLight(0xffffff, 5.0);
directionalLight.position.copy(camera.position);
scene.add(directionalLight); 

const spotLight = new THREE.SpotLight(0xffffff, 0);
scene.add(spotLight);
 



// Lade 3D Objekte
const loader = new GLTFLoader();

loader.load( 'models/snitch2/scene.gltf', function ( gltf ) {
  gltf.scene.scale.set(0.01, 0.01, 0.01);
  mixer = new THREE.AnimationMixer(gltf.scene);
  const clips = gltf.animations;
  const clip = THREE.AnimationClip.findByName(clips, 'Alas|Action');
  const action = mixer.clipAction(clip);
  action.play();
  snitch = gltf.scene;

	scene.add( gltf.scene );

}, undefined, function ( error ) {
  
	console.error( error );

} );


loader.load( 'models/traveler/scene.gltf', function ( gltf ) {
  /* gltf.scene.scale.set(0.01, 0.01, 0.01);
  mixer2 = new THREE.AnimationMixer(gltf.scene);
  const clips = gltf.animations;
  const clip = THREE.AnimationClip.findByName(clips, 'Alas|Action');
  const action = mixer.clipAction(clip);
  console.log(clips);
  action.play();
  snitch = gltf.scene; */
  traveler = gltf.scene;
  traveler.rotation.y = -1;
  traveler.position.z = -2; 
  traveler.position.x = 25;
//  traveler.position.x = 75;
  traveler.position.y = -55;

  traveler.scale.set(5, 5, 5);
  mixer2 = new THREE.AnimationMixer(traveler);
  const clips2 = gltf.animations;
  const clip2 = THREE.AnimationClip.findByName(clips2, 'Animation');
  const action = mixer2.clipAction(clip2);
  action.play();

	scene.add( traveler );

}, undefined, function ( error ) {
  
	console.error( error );

} );
const levelObjects = [];
const suitPosition = new THREE.Vector3();
const glassPosition = new THREE.Vector3();
const beensPosition = new THREE.Vector3();

loader.load( 'models/suitcase/scene.gltf', function ( gltf ) {
  gltf.scene.scale.set(0.25, 0.25, 0.25);
  gltf.scene.position.y = -143;
  gltf.scene.position.x = -29;
  gltf.scene.rotation.y = 0.7;
  levelObjects.push(gltf.scene);
  gltf.scene.traverse(function (child) {
    if (child instanceof THREE.Mesh) {
       child.userData.type = 'suitcase'; 
    }
  });
  suitPosition.copy(gltf.scene.position);
  scene.add(gltf.scene);

}, undefined, function ( error ) {
	console.error( error );
});

loader.load( 'models/potion/scene.gltf', function ( gltf ) {
  gltf.scene.scale.set(5.5, 5.5, 5.5);
  gltf.scene.position.y = -135;
  gltf.scene.position.x = 0;
  gltf.scene.rotation.y = 0.7; 
  mixer3 = new THREE.AnimationMixer(gltf.scene);
  const clips3 = gltf.animations;
  const clip3 = THREE.AnimationClip.findByName(clips3, 'Take 001');
  const action = mixer3.clipAction(clip3);
//  console.log(clip3);
  action.play();
  levelObjects.push(gltf.scene);
	scene.add( gltf.scene );

  gltf.scene.traverse(function (child) {
    if (child instanceof THREE.Mesh) {
       child.userData.type = 'potion'; 
    }
  });
  glassPosition.copy(gltf.scene.position);
  scene.add(gltf.scene)
 
   // Objekt light up
/* 
     */

}, undefined, function ( error ) {
  
	console.error( error );

} );

loader.load( 'models/beens/scene.gltf', function ( gltf ) {
  gltf.scene.scale.set(3, 3, 3);
  gltf.scene.position.y = -136;
  gltf.scene.position.x = 28;
  gltf.scene.position.z = -3;
//  gltf.scene.rotation.y = 0.7;
  levelObjects.push(gltf.scene);
  gltf.scene.traverse(function (child) {
    if (child instanceof THREE.Mesh) {
       child.userData.type = 'beens'; 
    }
  });
  beensPosition.copy(gltf.scene.position);
  scene.add(gltf.scene)
	scene.add( gltf.scene );

}, undefined, function ( error ) {
  
	console.error( error );

} );

// Snitch folgt Pfad
const points = [
  new THREE.Vector3(-40, 15, 0),
  new THREE.Vector3(-25, -5, 0),
  new THREE.Vector3(40, 0, 0),
  new THREE.Vector3(5, -20, 0),
  new THREE.Vector3(10, 0, 0)
];


const path = new THREE.CatmullRomCurve3(points, true);
const pathGeometry = new THREE.BufferGeometry().setFromPoints(path.getPoints(50));
const pathMaterial = new THREE.LineBasicMaterial({color:0xff0000});
const pathObject = new THREE.Line(pathGeometry, pathMaterial);
//scene.add(pathObject);

// Scrolling Effekte
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  if (traveler && traveler.position.x == 25) {
      traveler.rotation.y += 0.01;
  //   traveler.position.x += t * 0.1; 
  }
  
  camera.position.y = t * 0.09;
}
document.body.onscroll = moveCamera;
moveCamera();

// Click Events
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();


function onPointerMove( event ) {

  var rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ( ( event.clientX - rect.left ) / ( rect.width - rect.left ) ) * 2 - 1;
  pointer.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;

}

window.addEventListener( 'mousemove', onPointerMove );

//const spotLightHelper = new THREE.SpotLightHelper(spotLight);
//scene.add(spotLightHelper);

function render() {

	// update the picking ray with the camera and pointer position
	raycaster.setFromCamera( pointer, camera );
  const intersects = raycaster.intersectObjects( levelObjects );
  if ( intersects.length > 0 ) {
    const selectedObject = intersects[0].object;
    document.body.style.cursor = 'pointer';
    spotLight.angle = Math.PI / 5;
    spotLight.penumbra = 0.2;
    spotLight.distance = 30;
    spotLight.decay = 0;
    spotLight.position.x += 15;
        // Typ des angewählten Objekts überprüfen
        if (selectedObject.userData.type === 'suitcase') {
            // Hier kannst du weitere Aktionen für den Koffer ausführen
           //console.log('Suitcase selected');
           // Objekt light up

          spotLight.position.copy(suitPosition);
          spotLight.position.y += 20; // Beispiel: Versuche, das Licht höher zu positionieren
          spotLight.position.z += 10;
          spotLight.intensity = 25;

          spotLight.target.position.copy(suitPosition);
          scene.add(spotLight.target);
          spotLight.color.setHex(0xffffff);
          console.log("spotlight: ");
          console.log(spotLight.position);
     //    console.log(spotLight.target.position);
         console.log("Koffer:");
         console.log(suitPosition);
          
          
        } else if (selectedObject.userData.type === 'potion') {
          console.log('Potion selected');
          spotLight.position.copy(glassPosition);
          spotLight.position.y += 10;
          spotLight.position.z += 10;
          spotLight.intensity = 50;
          spotLight.color.setHex(0x97D997);

          spotLight.target.position.copy(glassPosition);
          scene.add(spotLight.target);
         console.log("spotlight:");
         console.log(spotLight.position);
     //    console.log("spotlight Target:"+spotLight.target.position);
         console.log("Glass:");
         console.log(glassPosition);

        } else if (selectedObject.userData.type === 'beens') {
         // console.log('Beens selected');
         spotLight.position.copy(beensPosition);
         spotLight.position.y += 10;
         spotLight.position.z += 5;
         spotLight.position.x -= 3;
         spotLight.intensity = 15;
         spotLight.color.setHex(0xffffff);
         spotLight.target.position.copy(beensPosition);
         scene.add(spotLight.target);
        }

  } else {
   // console.log("nop mousemouve");
   spotLight.intensity = 0;
   document.body.style.cursor = 'auto';
  }
}


window.addEventListener('click', event => {
  var rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ( ( event.clientX - rect.left ) / ( rect.width - rect.left ) ) * 2 - 1;
  pointer.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;
  
  raycaster.setFromCamera( pointer, camera );
  
  const intersects = raycaster.intersectObjects( levelObjects );

  
  if ( intersects.length > 0 ) {
    const selectedObject = intersects[0].object;
    if (selectedObject.userData.type === 'suitcase') {

     window.location.href = 'level1.html';
    
    
    } else if (selectedObject.userData.type === 'potion') {
      window.location.href = 'level2.html';

    } else if (selectedObject.userData.type === 'beens') {
      window.location.href = 'level3.html';
    }
  } else {

  //  console.log("nop click");

  }

})

window.requestAnimationFrame(render);



// Animiere die Scene
var a = true;
const clock = new THREE.Clock();
const clock2 = new THREE.Clock();
const clock3 = new THREE.Clock();

function animate() {
  if(mixer)
    mixer.update(clock.getDelta());
  if(mixer2)
    mixer2.update(clock2.getDelta());
  if(mixer3)
    mixer3.update(clock3.getDelta());
  const time = Date.now();
  const t = (time / 1500 % 6) / 6;
  const position = path.getPointAt(t);
  if(snitch) {
    snitch.position.copy(position);
    snitch.lookAt(camera.position);
  }
  render();
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}

animate();