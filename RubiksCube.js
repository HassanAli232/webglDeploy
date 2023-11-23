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

    document.getElementById("xButton").onclick = function() { axis = xAxis; flag = !flag; };
    document.getElementById("yButton").onclick = function() { axis = yAxis; flag = !flag; };
    document.getElementById("zButton").onclick = function() { axis = zAxis; flag = !flag; };
    document.getElementById("ButtonT").onclick = function(){flag = !flag;};

    render();
};

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if(flag ) theta[axis] += 2.0;
    gl.uniform3fv(thetaLoc, theta);

    rubiksCube.render(theta);
    requestAnimFrame(render);
}

class RubiksCube {
    constructor(gl, program) {
        this.gl = gl;
        this.program = program;
        this.cubes = [];
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
                colors.push(vertexColors[a]);
            }
        };

        quad(1, 0, 3, 2);
        quad(2, 3, 7, 6);
        quad(3, 0, 4, 7);
        quad(6, 5, 1, 2);
        quad(4, 5, 6, 7);
        quad(5, 4, 0, 1);

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

