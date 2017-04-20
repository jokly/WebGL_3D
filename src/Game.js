import { vec3 } from 'gl-matrix';

import Program from './Program';
import Geometry from './Geometry';
import Texture from './Texture';
import Renderer from './Renderer';
import Pipeline from './Pipeline';
import Camera from './Camera';

let canvas = document.getElementById('webgl-canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let glContext = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

let renderer = new Renderer(glContext, canvas.width, canvas.height);

let camera = new Camera(0, 0, 10);
renderer.setCamera(camera)

let program = new Program(glContext);
program.setVertexShader('shader-vs');
program.setFragmentShader('shader-fs');
program.setUniform('uSampler', 0,  'uniform1i');

let vertices = [
    // Front face
      -1.0, -1.0,  1.0,
       1.0, -1.0,  1.0,
       1.0,  1.0,  1.0,
      -1.0,  1.0,  1.0,
      // Back face
      -1.0, -1.0, -1.0,
      -1.0,  1.0, -1.0,
       1.0,  1.0, -1.0,
       1.0, -1.0, -1.0,
      // Top face
      -1.0,  1.0, -1.0,
      -1.0,  1.0,  1.0,
       1.0,  1.0,  1.0,
       1.0,  1.0, -1.0,
      // Bottom face
      -1.0, -1.0, -1.0,
       1.0, -1.0, -1.0,
       1.0, -1.0,  1.0,
      -1.0, -1.0,  1.0,
      // Right face
       1.0, -1.0, -1.0,
       1.0,  1.0, -1.0,
       1.0,  1.0,  1.0,
       1.0, -1.0,  1.0,
      // Left face
      -1.0, -1.0, -1.0,
      -1.0, -1.0,  1.0,
      -1.0,  1.0,  1.0,
      -1.0,  1.0, -1.0,
];

let indices = [
    0, 1, 2,      0, 2, 3,    // Front face
    4, 5, 6,      4, 6, 7,    // Back face
    8, 9, 10,     8, 10, 11,  // Top face
    12, 13, 14,   12, 14, 15, // Bottom face
    16, 17, 18,   16, 18, 19, // Right face
    20, 21, 22,   20, 22, 23  // Left face
];

var textureCoords = [
      // Front face
      0.0, 0.0,
      3.0, 0.0,
      3.0, 3.0,
      0.0, 3.0,
      // Back face
      3.0, 0.0,
      3.0, 3.0,
      0.0, 3.0,
      0.0, 0.0,
      // Top face
      0.0, 3.0,
      0.0, 0.0,
      3.0, 0.0,
      3.0, 3.0,
      // Bottom face
      3.0, 3.0,
      0.0, 3.0,
      0.0, 0.0,
      3.0, 0.0,
      // Right face
      3.0, 0.0,
      3.0, 3.0,
      0.0, 3.0,
      0.0, 0.0,
      // Left face
      0.0, 0.0,
      3.0, 0.0,
      3.0, 3.0,
      0.0, 3.0,
];

let texture = new Texture(glContext, 'img/brickwall.png');

let zTranslate = 0;
for (let i = 0; i < 10; i++) {
    let geometry = new Geometry(glContext);
    geometry.addAttribute('vertexPosition', new Float32Array(vertices), 3);
    geometry.setIndices(new Uint16Array(indices));
    geometry.addAttribute('textureCoord', new Float32Array(textureCoords), 2);
    geometry.setTexture(texture);
    geometry.setTranslate(0, 0, zTranslate);
    geometry.setScale(3, 3, 3);
    renderer.addGeometry(geometry);

    zTranslate += 2;
}

let floorVert = [
    -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,
];

let floorInd = [
    0, 1, 2,
    0, 2, 3
];

let floorTexInd = [
    0.0, 0.0,
    100.0, 0.0,
    100.0, 100.0,
    0.0, 100.0,
];

let floorTex = new Texture(glContext, 'img/stone.png');

let floor = new Geometry(glContext);
floor.addAttribute('vertexPosition', new Float32Array(floorVert), 3);
floor.setIndices(new Uint16Array(floorInd));
floor.addAttribute('textureCoord', new Float32Array(floorTexInd), 2);
floor.setTexture(floorTex);
floor.setTranslate(0, 0, 10);
floor.setScale(100, 1, 100);
renderer.addGeometry(floor);

let pipeline = new Pipeline();
pipeline.setPerspective(canvas.width, canvas.height);
renderer.setPipeline(pipeline);

renderer.setProgram(program);

function render() {
    window.requestAnimFrame(render);
    handleKeys();
    camera.updateCameraMatrix();
    renderer.render();
    camera.animate();
}

window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame   ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.ieRequestAnimationFrame     ||
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
})();

let currentlyPressedKeys = {};

document.onkeydown = function(e) {
    currentlyPressedKeys[e.keyCode] = true;
};

document.onkeyup = function(e) {
    currentlyPressedKeys[e.keyCode] = false;

    if (e.keyCode == 32) {
        let block = new Geometry(glContext);
        block.addAttribute('vertexPosition', new Float32Array(vertices), 3);
        block.setIndices(new Uint16Array(indices));
        block.addAttribute('textureCoord', new Float32Array(textureCoords), 2);
        block.setTexture(texture);
        let cameraPos = camera.getCoords();
        let cameraMatrix = camera.getCameraMatrix();
        let diff = [0, 0, 0];

        if (cameraMatrix[2] > 0.5) {
            diff[0] = -3;
        }
        else if (cameraMatrix[2] < -0.5) {
            diff[0] = 3;
        }

        if (cameraMatrix[10] > 0.5) {
            diff[2] = -3;
        }
        else if (cameraMatrix[10] < -0.5) {
            diff[2] = 3;
        }

        block.setTranslate(cameraPos.x + diff[0], cameraPos.y + diff[1], cameraPos.z + diff[2]);
        renderer.addGeometry(block);
    }
}

function handleKeys() {
    if (currentlyPressedKeys[33]) {
        camera.setPitchRate(0.2);
    } else if (currentlyPressedKeys[34]) {
        camera.setPitchRate(-0.2);
    } else {
        camera.setPitchRate(0);
    }


    if (currentlyPressedKeys[37] || currentlyPressedKeys[65]) {
        // Left cursor key or A
        camera.setYawRate(0.2);
    } else if (currentlyPressedKeys[39] || currentlyPressedKeys[68]) {
        // Right cursor key or D
        camera.setYawRate(-0.2);
    } else {
        camera.setYawRate(0);
    }

    if (currentlyPressedKeys[38] || currentlyPressedKeys[87]) {
        // Up cursor key or W
        camera.setSpeed(0.05);
    } else if (currentlyPressedKeys[40] || currentlyPressedKeys[83]) {
        // Down cursor key
        camera.setSpeed(-0.05);
    } else {
        camera.setSpeed(0);
    }
}

window.onresize = function(event) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    pipeline.setPerspective(canvas.width, canvas.height);
    renderer.setViewport(canvas.width, canvas.height);
};

window.onmousemove = function(event) {
    // change camera matrix on mouse move
};

render();
