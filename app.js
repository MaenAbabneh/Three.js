import * as THREE from 'three';
import GUI from 'lil-gui';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DragControls } from 'three/addons/controls/DragControls.js';


function main() {
const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({antialias: true , canvas });
const gui = new GUI();
gui.show();

const fov = 75;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 1000;

const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

renderer.setSize(window.innerWidth , window.innerHeight );

const scene = new THREE.Scene();

const sceneSettings = {
  background: '#1e1e24',
  ambientIntensity: 0.6,
  ambientColor: '#ffffff',
  dirIntensity: 1.2,
  dirColor: '#ffffff',
  pointIntensity: 1.5,
  pointColor: '#ffddaa',
  dirX: 3,
  dirY: 5,
  dirZ: 2,
  pointX: 0,
  pointY: 5,
  pointZ: 0,
  spotIntensity: 1,
  spotColor: '#ffffff',
  spotX: 0,
  spotY: 0,
  spotZ: 0,
  angle: Math.PI / 6,
  penumbra: 0.1,
  decay: 2,
  distance: 200,
  castShadow: true,
  mapSizeWidth: 1024,
  mapSizeHeight: 1024,
  shadowCameraNear: 10,
  shadowCameraFar: 200,
  far: 1000,
  near: 0.1,
};

scene.background = new THREE.Color(sceneSettings.background);

const cubeObj = {
  boxWidth: 1,
  boxHeight: 1,
  boxDepth: 1,
  color: '#ffea00',
};

const sphereObj = {
  radius: 0.5,
  widthSegments: 32,
  heightSegments: 32,
  color: '#7777ff',
};

const planeObj = {
  width: 5,
  height: 5,
  widthSegments: 8,
  heightSegments: 8,
  color: '#00ff00',
};

const cubeFolder = gui.addFolder('cube parameters');
cubeFolder.addColor(cubeObj, 'color').onChange(() => {
  cubeMesh.material.color.set(cubeObj.color);
});
cubeFolder.add(cubeObj, 'boxWidth', 0.1, 5).onChange(updateGeometries);
cubeFolder.add(cubeObj, 'boxHeight', 0.1, 5).onChange(updateGeometries);
cubeFolder.add(cubeObj, 'boxDepth', 0.1, 5).onChange(updateGeometries);

const sphereFolder = gui.addFolder('sphere parameters');
sphereFolder.addColor(sphereObj, 'color').onChange(() => {
  sphereMesh.material.color.set(sphereObj.color);
});
sphereFolder.add(sphereObj, 'radius', 0.1, 5).onChange(updateGeometries);
sphereFolder.add(sphereObj, 'widthSegments', 3, 64).step(1).onChange(updateGeometries);
sphereFolder.add(sphereObj, 'heightSegments', 2, 64).step(1).onChange(updateGeometries);

const planeFolder = gui.addFolder('plane parameters');
planeFolder.addColor(planeObj, 'color').onChange(() => {
  planeMesh.material.color.set(planeObj.color);
});
planeFolder.add(planeObj, 'width', 1, 10).onChange(updateGeometries);
planeFolder.add(planeObj, 'height', 1, 10).onChange(updateGeometries);
planeFolder.add(planeObj, 'widthSegments', 1, 20).step(1).onChange(updateGeometries);
planeFolder.add(planeObj, 'heightSegments', 1, 20).step(1).onChange(updateGeometries);

const sceneFolder = gui.addFolder('scene');
sceneFolder.addColor(sceneSettings, 'background').onChange((value) => {
  scene.background = new THREE.Color(value);
});

const ambientFolder = gui.addFolder('lights');
ambientFolder.add(sceneSettings, 'ambientIntensity', 0, 5).onChange((value) => {
  ambientLight.intensity = value;
});
ambientFolder.addColor(sceneSettings, 'ambientColor').onChange((value) => {
  ambientLight.color.set(value);
});
const dirFolder = gui.addFolder('directional light');
dirFolder.add(sceneSettings, 'dirIntensity', 0, 5).onChange((value) => {
  dirLight.intensity = value;
});
dirFolder.addColor(sceneSettings, 'dirColor').onChange((value) => {
  dirLight.color.set(value);
});
dirFolder.add(sceneSettings, 'dirX', -10, 10).onChange((value) => {
  dirLight.position.x = value;
});
dirFolder.add(sceneSettings, 'dirY', -10, 10).onChange((value) => {
  dirLight.position.y = value;
});
dirFolder.add(sceneSettings, 'dirZ', -10, 10).onChange((value) => {
  dirLight.position.z = value;
});
const pointFolder = gui.addFolder('point light');
pointFolder.add(sceneSettings, 'pointIntensity', 0, 10).onChange((value) => {
  pointLight.intensity = value;
});
pointFolder.addColor(sceneSettings, 'pointColor').onChange((value) => {
  pointLight.color.set(value);
});
pointFolder.add(sceneSettings, 'pointX', -10, 10).onChange((value) => {
  pointLight.position.x = value;
});
pointFolder.add(sceneSettings, 'pointY', -10, 10).onChange((value) => {
  pointLight.position.y = value;
});
pointFolder.add(sceneSettings, 'pointZ', -10, 10).onChange((value) => {
  pointLight.position.z = value;
});
const spotFolder = gui.addFolder('spot light');
spotFolder.add(sceneSettings, 'spotIntensity', 0, 10).onChange((value) => {
  spotLight.intensity = value;
});
spotFolder.add(sceneSettings, 'spotX', -10, 10).onChange((value) => {
  spotLight.position.x = value;
});
spotFolder.add(sceneSettings, 'spotY', -10, 10).onChange((value) => {
  spotLight.position.y = value;
});
spotFolder.add(sceneSettings, 'spotZ', -10, 10).onChange((value) => {
  spotLight.position.z = value;
});
spotFolder.addColor(sceneSettings, 'spotColor').onChange((value) => {
  spotLight.color.set(value);
});
spotFolder.add(sceneSettings, 'angle', 0, Math.PI / 2).onChange((value) => {
  spotLight.angle = value;
});
spotFolder.add(sceneSettings, 'penumbra', 0, 1).onChange((value) => {
  spotLight.penumbra = value;
});
spotFolder.add(sceneSettings, 'decay', 1, 5).onChange((value) => {
  spotLight.decay = value;
});
spotFolder.add(sceneSettings, 'distance', 0, 100).onChange((value) => {
  spotLight.distance = value;
});
spotFolder.add(sceneSettings, 'castShadow').onChange((value) => {
  spotLight.castShadow = value;
});
spotFolder.add(sceneSettings, 'mapSizeWidth', 0, 2048).step(1).onChange((value) => {
  spotLight.shadow.mapSize.width = value;
  spotLight.shadow.map.dispose();
  spotLight.shadow.map = null;
});
spotFolder.add(sceneSettings, 'mapSizeHeight', 0, 2048).step(1).onChange((value) => {
  spotLight.shadow.mapSize.height = value;
  spotLight.shadow.map.dispose();
  spotLight.shadow.map = null;
});
spotFolder.add(sceneSettings, 'shadowCameraNear', 0.1, 50).onChange((value) => {
  spotLight.shadow.camera.near = value;
  spotLight.shadow.camera.updateProjectionMatrix();
});
spotFolder.add(sceneSettings, 'shadowCameraFar', 50, 500).onChange((value) => {
  spotLight.shadow.camera.far = value;
  spotLight.shadow.camera.updateProjectionMatrix();
});
spotFolder.add(sceneSettings, 'far', 0.1, 1000).onChange((value) => {
  scene.fog.far = value;
});
spotFolder.add(sceneSettings, 'near', 0.1, 100).onChange((value) => {
  scene.fog.near = value;
});


const cube = new THREE.BoxGeometry(cubeObj.boxWidth, cubeObj.boxHeight, cubeObj.boxDepth);
const sphere = new THREE.SphereGeometry(sphereObj.radius, sphereObj.widthSegments, sphereObj.heightSegments);
const plane = new THREE.PlaneGeometry(planeObj.width, planeObj.height , planeObj.widthSegments , planeObj.heightSegments);


const cubeMesh = new THREE.Mesh(cube, new THREE.MeshStandardMaterial({ color: cubeObj.color }));
const sphereMesh = new THREE.Mesh(sphere, new THREE.MeshStandardMaterial({ color: sphereObj.color }));
const planeMesh = new THREE.Mesh(plane, new THREE.MeshStandardMaterial({ color: planeObj.color , wireframe: true }));

const ambientLight = new THREE.AmbientLight(sceneSettings.ambientColor, sceneSettings.ambientIntensity);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(sceneSettings.dirColor, sceneSettings.dirIntensity);
dirLight.position.set(sceneSettings.dirX, sceneSettings.dirY, sceneSettings.dirZ);
scene.add(dirLight);

const pointLight = new THREE.PointLight(sceneSettings.pointColor, sceneSettings.pointIntensity, 100);
pointLight.position.set(sceneSettings.pointX, sceneSettings.pointY, sceneSettings.pointZ);
scene.add(pointLight);

const spotLight = new THREE.SpotLight(sceneSettings.spotColor, sceneSettings.spotIntensity, 100);
spotLight.position.set(sceneSettings.spotX, sceneSettings.spotY, sceneSettings.spotZ);
spotLight.angle = sceneSettings.angle;
spotLight.penumbra = sceneSettings.penumbra;
spotLight.decay = sceneSettings.decay;
spotLight.distance = sceneSettings.distance;
spotLight.castShadow = sceneSettings.castShadow;
spotLight.shadow.mapSize.width = sceneSettings.mapSizeWidth;
spotLight.shadow.mapSize.height = sceneSettings.mapSizeHeight;
spotLight.shadow.camera.near = sceneSettings.shadowCameraNear;
spotLight.shadow.camera.far = sceneSettings.shadowCameraFar;
spotLight.shadow.camera.updateProjectionMatrix();
scene.add(spotLight);

function updateGeometries() {
  // Update cube geometry
  cubeMesh.geometry.dispose();
  cubeMesh.geometry = new THREE.BoxGeometry(cubeObj.boxWidth, cubeObj.boxHeight, cubeObj.boxDepth);
  // Update sphere geometry
  sphereMesh.geometry.dispose();
  sphereMesh.geometry = new THREE.SphereGeometry(sphereObj.radius, sphereObj.widthSegments, sphereObj.heightSegments);
  // Update plane geometry
  planeMesh.geometry.dispose();
  planeMesh.geometry = new THREE.PlaneGeometry(planeObj.width, planeObj.height , planeObj.widthSegments , planeObj.heightSegments);
}

// add 
scene.add(sphereMesh , cubeMesh, planeMesh);
cubeMesh.position.set(-1, 0, 0);
sphereMesh.position.set(1, 0, 0);
planeMesh.rotation.x = Math.PI / 2;
planeMesh.position.y = -0.5;

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false); // false هنا مهمة لمنع Three.js من تعديل الستايل CSS
  }
  return needResize;
}

// Initialize OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // smooth camera movement
controls.dampingFactor = 0.05;
controls.target.set(0, 0, 0);
controls.update();

// Initialize dragging functionality
const dragControls = new DragControls([cubeMesh, sphereMesh, planeMesh], camera, renderer.domElement);

    dragControls.addEventListener('dragstart', function () {
        controls.enabled = false; // Disable OrbitControls while dragging
    });

    dragControls.addEventListener('dragend', function () {
        controls.enabled = true; // Re-enable OrbitControls after dragging
    });

// Render loop
function render() {
    
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

    controls.update(); // Update controls for damping

    renderer.render(scene, camera);
    requestAnimationFrame(render);

}

requestAnimationFrame(render);
camera.position.set(0, 2, 5);
camera.lookAt(0, 0, 0);


}

main();