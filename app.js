import * as THREE from 'three';
function main() {
const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({antialias: true , canvas });

const fov = 75;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 1000;

const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

renderer.setSize(window.innerWidth , window.innerHeight );

const scene = new THREE.Scene();

const boxWidth = 1;
const boxHeight = 1;
const boxDepth = 1;

const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

function makeInstance(color , geometry , x) {
    const material = new THREE.MeshBasicMaterial({ color: color });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    cube.position.x = x;

    return cube;
}

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

const cubes = [
    makeInstance(0x44aa88, geometry, 0),
    makeInstance(0x8844aa, geometry, -2),
    makeInstance(0xaa8844, geometry, 2),
];

function render(time) {
    time *= 0.001;  // convert time to seconds
    
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

    cubes.forEach((cube, ndx) => {
        const speed = 1 + ndx * .1;
        const rot = time * speed;
        cube.rotation.x = rot;
        cube.rotation.y = rot;
    });
    renderer.render(scene, camera);
    requestAnimationFrame(render);

}

requestAnimationFrame(render);

camera.position.z = 2;
}

main();