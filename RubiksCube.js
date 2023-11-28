// Initialization of global variables
var canvas;
var gl;
var rubiksCube;

var xAxis = 0, yAxis = 1, zAxis = 2;
var axis = 0;
var theta = [0, 0, 0];
var flag = true;

// Initialization function
window.onload = function init() {
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    rubiksCube = new RubiksCube(gl, program);

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Set background to black
    gl.enable(gl.DEPTH_TEST);

    thetaLoc = gl.getUniformLocation(program, "theta");

    document.getElementById("xButton").onclick = function() { axis = xAxis; theta[xAxis] += 2; };
    document.getElementById("yButton").onclick = function() { axis = yAxis; theta[yAxis] += 2; };
    document.getElementById("zButton").onclick = function() { axis = zAxis; theta[zAxis] += 2; };
    document.getElementById("ButtonT").onclick = function() {flag = !flag;};

    render();
};

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if(flag) theta[axis] += 2.0;
    gl.uniform3fv(thetaLoc, theta);

    rubiksCube.render(theta);
    requestAnimFrame(render);
}

class RubiksCube {
    constructor(gl, program) {
        this.gl = gl;
        this.program = program;
        this.cubes = [ ];
        this.initCubes();
    }

    initCubes() {
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                for (let z = -1; z <= 1; z++) {
                    if (x === 0 && y === 0 && z === 0) continue;
                    this.cubes.push(new Cube(this.gl, this.program, x, y, z));
                }
            }
        }
    }

    updateCubePositionsAfterRotation(needToBeRotated1, needToBeRotated2, rotationFlag){
        if(!rotationFlag){
            needToBeRotated1.reverse();
            needToBeRotated2.reverse();
        }
        var tempCube1 = needToBeRotated1[3]
        var tempCube2 = needToBeRotated2[3]
        for(var i=3; i>=1; i--){
            this.cubes[needToBeRotated1[i]] = this.cubes[needToBeRotated1[i-1]]
            this.cubes[needToBeRotated2[i]] = this.cubes[needToBeRotated2[i-1]]
        }
        this.cubes[needToBeRotated1[0]] = tempCube1;
        this.cubes[needToBeRotated2[0]] = tempCube2;
    }

    rotateRight(isClockwise){
        //Select all cubes need to be rotated
        edgesArray = [19, 21, 25, 23]   //for 2 colored cubes
        cornersArray = [18, 24, 26, 20] //for 3 colored cubes (corners)
        center = 22                     //need to rotate texture

        //TODO rotate all cubes w.r.t x direction

        //

        //fix positions of cubes after rotation
        updateCubePositionsAfterRotation(edgesArray, cornersArray, isClockwise);
    }

    rotateLeft(isClockwise){
        //Select all cubes need to be rotated
        edgesArray = [3, 1, 5, 7]
        cornersArray = [6, 0, 2, 8]
        center = 4

        //TODO rotate all cubes w.r.t x direction

        //

        //fix positions of cubes after rotation
        updateCubePositionsAfterRotation(edgesArray, cornersArray, isClockwise);
    }

    rotateUp(isClockwise){
        //Select all cubes need to be rotated
        edgesArray = [15, 7, 17, 25]
        cornersArray = [24, 6, 8, 28]
        center = 16

        //TODO rotate all cubes w.r.t x direction

        //

        //fix positions of cubes after rotation
        updateCubePositionsAfterRotation(edgesArray, cornersArray, isClockwise);
    }

    rotateDown(isClockwise){
        //Select all cubes need to be rotated
        edgesArray = [1, 9, 19, 11]
        cornersArray = [0, 18, 20, 2]
        center = 10

        //TODO rotate all cubes w.r.t x direction

        //

        //fix positions of cubes after rotation
        updateCubePositionsAfterRotation(edgesArray, cornersArray, isClockwise);
    }

    rotateFront(isClockwise){
        //Select all cubes need to be rotated
        edgesArray = [21, 9, 3, 15]
        cornersArray = [24, 18, 0, 6]
        center = 12

        //TODO rotate all cubes w.r.t x direction

        //

        //fix positions of cubes after rotation
        updateCubePositionsAfterRotation(edgesArray, cornersArray, isClockwise);
    }

    rotateBack(isClockwise){
        //Select all cubes need to be rotated
        edgesArray = [17, 5, 11, 23]
        cornersArray = [26, 8, 2, 20]
        center = 14

        //TODO rotate all cubes w.r.t x direction
        this.cubes[14].chip =
        //

        //fix positions of cubes after rotation
        updateCubePositionsAfterRotation(edgesArray, cornersArray, isClockwise);
    }

    rotateMiddleRight(isClockwise){
        //Select all cubes need to be rotated
        centersArray = [12, 16, 14, 10]
        cornersArray = [9, 15, 17, 11]

        //TODO rotate all cubes w.r.t x direction

        //

        //fix positions of cubes after rotation
        updateCubePositionsAfterRotation(edgesArray, cornersArray, isClockwise);
    }

    rotateMiddleFront(isClockwise){
        //Select all cubes need to be rotated
        centersArray = [4, 16, 22, 10]
        cornersArray = [1, 7, 25, 19]

        //TODO rotate all cubes w.r.t x direction

        //

        //fix positions of cubes after rotation
        updateCubePositionsAfterRotation(edgesArray, cornersArray, isClockwise);
    }

    rotateMiddleUp(isClockwise){
        //Select all cubes need to be rotated
        centersArray = [12, 4, 14, 22]
        cornersArray = [3, 5, 23, 21]

        //TODO rotate all cubes w.r.t x direction

        //

        //fix positions of cubes after rotation
        updateCubePositionsAfterRotation(edgesArray, cornersArray, isClockwise);
    }

    render(theta) {
        
        var modelViewMatrix = mat4();
        modelViewMatrix = mult(modelViewMatrix, rotate(theta[xAxis], [1, 0, 0]));
        modelViewMatrix = mult(modelViewMatrix, rotate(theta[yAxis], [0, 1, 0]));
        modelViewMatrix = mult(modelViewMatrix, rotate(theta[zAxis], [0, 0, 1]));
        
        for (let cube of this.cubes) {
            cube.render(modelViewMatrix);
        }
    }
}

class Cube {
    constructor(gl, program, x, y, z) {
        this.gl = gl;
        this.program = program;
        this.x = x * 1.2;  // Slightly increased offset for gaps
        this.y = y * 1.2;
        this.z = z * 1.2;
        //! i think we need to store all chips (points with their colors)
        
        this.initBuffers();
    }

    initBuffers() {
        var points = [];
        var colors = [];
        var vertexColors = [
            [ 0.0, 0.0, 0.0, 1.0 ],  // black
            [ 1.0, 0.0, 0.0, 1.0 ],  // red
            [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
            [ 0.0, 1.0, 0.0, 1.0 ],  // green
            [ 0.0, 0.0, 1.0, 1.0 ],  // blue
            [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
            [ 0.0, 1.0, 1.0, 1.0 ],  // cyan
            [ 1.0, 1.0, 1.0, 1.0 ]   // white
        ];

        this.vertices = [
            vec4(-0.5, -0.5,  0.5, 1.0),
            vec4(-0.5,  0.5,  0.5, 1.0),
            vec4( 0.5,  0.5,  0.5, 1.0),
            vec4( 0.5, -0.5,  0.5, 1.0),
            vec4(-0.5, -0.5, -0.5, 1.0),
            vec4(-0.5,  0.5, -0.5, 1.0),
            vec4( 0.5,  0.5, -0.5, 1.0),
            vec4( 0.5, -0.5, -0.5, 1.0)
        ];


        let quad = (a, b, c, d) => {
            var indices = [a, b, c, a, c, d];
            for (let i = 0; i < indices.length; i++) {
                points.push(this.vertices[indices[i]]);
                // this works because every side will have the same color in all 27 cubes
                colors.push(vertexColors[a]);
            }
        };

        quad(1, 0, 3, 2);
        quad(2, 3, 7, 6);
        quad(3, 0, 4, 7);
        quad(4, 5, 6, 7);
        quad(5, 4, 0, 1);
        quad(6, 5, 1, 2);

        var cBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, cBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, flatten(colors), this.gl.STATIC_DRAW);
        var vColor = this.gl.getAttribLocation(this.program, "vColor");
        this.gl.vertexAttribPointer(vColor, 4, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(vColor);

        var vBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, flatten(points), this.gl.STATIC_DRAW);
        var vPosition = this.gl.getAttribLocation(this.program, "vPosition");
        this.gl.vertexAttribPointer(vPosition, 4, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(vPosition);
    }

    render(modelViewMatrix) {
        var modelViewMatrixLoc = this.gl.getUniformLocation(this.program, "modelViewMatrix");
        var localModelViewMatrix = mult(modelViewMatrix, translate(this.x, this.y, this.z));
        localModelViewMatrix = mult(localModelViewMatrix, scalem(0.3, 0.3, 0.3));

        this.gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(localModelViewMatrix));
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 36);
    }
}