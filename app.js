import * as THREE from 'three';
import GUI from 'lil-gui';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DragControls } from 'three/addons/controls/DragControls.js';
import { Water } from 'three/addons/objects/Water.js';
import { Sky } from 'three/addons/objects/Sky.js';

function main() {
const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({antialias: true , canvas });
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.5;
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
  // Sky and Sun settings
  turbidity: 10,
  rayleigh: 2,
  mieCoefficient: 0.005,
  mieDirectionalG: 0.8,
  elevation: 2,
  azimuth: 180,
  sunIntensity: 1,
};

// Don't set a solid background color - let the sky show through
// scene.background will be the sky itself

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
sceneFolder.add(sceneSettings, 'ambientIntensity', 0, 2).onChange(() => {
  ambientLight.intensity = sceneSettings.ambientIntensity;
});

const skyFolder = gui.addFolder('Sky & Sun');
skyFolder.add(sceneSettings, 'turbidity', 0.0, 20.0).onChange((value) => {
  sky.material.uniforms['turbidity'].value = value;
});
skyFolder.add(sceneSettings, 'rayleigh', 0.0, 4.0).onChange((value) => {
  sky.material.uniforms['rayleigh'].value = value;
});
skyFolder.add(sceneSettings, 'mieCoefficient', 0.0, 0.1).onChange((value) => {
  sky.material.uniforms['mieCoefficient'].value = value;
});
skyFolder.add(sceneSettings, 'mieDirectionalG', 0.0, 1.0).onChange((value) => {
  sky.material.uniforms['mieDirectionalG'].value = value;
});
skyFolder.add(sceneSettings, 'elevation', 0, 90).onChange(updateSun);
skyFolder.add(sceneSettings, 'azimuth', -180, 180).onChange(updateSun);
skyFolder.add(sceneSettings, 'sunIntensity', 0, 3).onChange((value) => {
  sunLight.intensity = value;
});


// Geometries
const cube = new THREE.BoxGeometry(cubeObj.boxWidth, cubeObj.boxHeight, cubeObj.boxDepth);
const sphere = new THREE.SphereGeometry(sphereObj.radius, sphereObj.widthSegments, sphereObj.heightSegments);
const plane = new THREE.PlaneGeometry(planeObj.width, planeObj.height , planeObj.widthSegments , planeObj.heightSegments);

// Water setup
const textureLoader = new THREE.TextureLoader();
textureLoader.setCrossOrigin('anonymous');
const waterGeometry = new THREE.PlaneGeometry(10, 10, 256, 256);
const water = new Water(waterGeometry, {
  textureWidth: 512,
  textureHeight: 512,
  waterNormals: textureLoader.load('https://threejs.org/examples/textures/waternormals.jpg', (texture) => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  }),
  alpha: 1.0,
  sunDirection: new THREE.Vector3(),
  sunColor: 0xffffff,
  waterColor: 0x001e0f,
  distortionScale: 3.7,
  fog: scene.fog !== undefined
});

// Skybox setup
const sky = new Sky();
sky.scale.setScalar(10000);
scene.add(sky);

const skyUniforms = sky.material.uniforms;
skyUniforms['turbidity'].value = sceneSettings.turbidity;
skyUniforms['rayleigh'].value = sceneSettings.rayleigh;
skyUniforms['mieCoefficient'].value = sceneSettings.mieCoefficient;
skyUniforms['mieDirectionalG'].value = sceneSettings.mieDirectionalG;

// Sun position
const sun = new THREE.Vector3();

// Sun light (directional light as sun)
const sunLight = new THREE.DirectionalLight(0xffffff, sceneSettings.sunIntensity);
sunLight.castShadow = true;
scene.add(sunLight);

function updateSun() {
  const phi = THREE.MathUtils.degToRad(90 - sceneSettings.elevation);
  const theta = THREE.MathUtils.degToRad(sceneSettings.azimuth);
  sun.setFromSphericalCoords(1, phi, theta);
  sky.material.uniforms['sunPosition'].value.copy(sun);
  water.material.uniforms['sunDirection'].value.copy(sun).normalize();
  sunLight.position.set(sun.x * 100, sun.y * 100, sun.z * 100);
}

updateSun();

// Meshes
const cubeMesh = new THREE.Mesh(cube, new THREE.MeshStandardMaterial({ color: cubeObj.color }));
const sphereMesh = new THREE.Mesh(sphere, new THREE.MeshStandardMaterial({ color: sphereObj.color }));
const planeMesh = new THREE.Mesh(plane, new THREE.MeshStandardMaterial({ color: planeObj.color , wireframe: true }));

// Function to update geometries
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

const ambientLight = new THREE.AmbientLight(sceneSettings.ambientColor, sceneSettings.ambientIntensity);
scene.add(ambientLight);

// add 
scene.add(sphereMesh , cubeMesh, planeMesh);
// add water surface and align as ground plane
water.rotation.x = -Math.PI / 2;
water.position.y = -0.5;
scene.add(water);
// hide helper plane to avoid visual overlap
planeMesh.visible = false;
cubeMesh.position.set(-1, 0, 0);
sphereMesh.position.set(1, 0, 0);
planeMesh.rotation.x = Math.PI / 2;
planeMesh.position.y = -0.5;

// Resize function
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

    // animate water time uniform for waves
    if (water && water.material && water.material.uniforms && water.material.uniforms['time']) {
      water.material.uniforms['time'].value += 1.0 / 60.0;
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