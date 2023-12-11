class Cube {
  constructor(gl, program, x, y, z, size) {
    this.gl = gl;
    this.program = program;

    this.center = [x, y, z];
    this.size = size;
    this.theta = [0, 0, 0]; // in degree.

    this.points = [];
    this.colors = [];

    var red = [1.0, 0.0, 0.0, 1.0];
    var blue = [0.0, 0.0, 1.0, 1.0];
    var green = [0.0, 1.0, 0.0, 1.0];
    var yellow = [1.0, 1.0, 0.0, 1.0];
    var magenta = [1.0, 0.0, 1.0, 1.0];
    var white = [1.0, 1.0, 1.0, 1.0];

    this.upColor = white;
    this.rightColor = green;
    this.bottomColor = yellow;
    this.leftColor = blue;
    this.frontColor = red;
    this.backColor = magenta;

    this.generateColorCube();
    // this.initBuffers();
  }

  setColors(up, right, bottom, left, front, back) {
    this.upColor = up;
    this.rightColor = right;
    this.bottomColor = bottom;
    this.leftColor = left;
    this.frontColor = front;
    this.backColor = back;

    // Reset the cube.
    this.points = [];
    this.colors = [];

    this.generateColorCube();
  }

  getInfo() {
    return [this.points, this.colors];
  }

  getCenter() {
    return this.center;
  }

  rotate(theta) {
    // this.theta[0] = (this.theta[0] + theta[0]) % 360;
    // this.theta[1] = (this.theta[1] + theta[1]) % 360;
    // this.theta[2] = (this.theta[2] + theta[2]) % 360;

    // Define rotation matrices for each axis
    var rotateX = rotate(theta[0], [1, 0, 0]);
    var rotateY = rotate(theta[1], [0, 1, 0]);
    var rotateZ = rotate(theta[2], [0, 0, 1]);

    // Multiply the rotation matrices to get the final rotation matrix
    var rotateMatrix = mult(mult(rotateX, rotateY), rotateZ);

    // Apply the rotation matrix to each point
    for (let i = 0; i < this.points.length; i++) {
      this.points[i] = this.multMat4Vec4(rotateMatrix, this.points[i]);
    }
  }

  generateColorCube() {
    this.quad(1, 0, 3, 2, this.backColor, this.center, this.size); // back side.
    this.quad(2, 3, 7, 6, this.rightColor, this.center, this.size); // right side.
    this.quad(3, 0, 4, 7, this.bottomColor, this.center, this.size); // bottom side.
    this.quad(6, 5, 1, 2, this.upColor, this.center, this.size); // up side.
    this.quad(4, 5, 6, 7, this.frontColor, this.center, this.size); // front side.
    this.quad(5, 4, 0, 1, this.leftColor, this.center, this.size); // left side.
  }

  multMat4Vec4(mat, vec) {
    var result = [];
    for (var i = 0; i < 4; ++i) {
      result[i] = 0.0;
      for (var j = 0; j < 4; ++j) {
        result[i] += mat[i][j] * vec[j];
      }
    }
    return result;
  }

  quad(a, b, c, d, color = -1, center = [0, 0, 0], sideSize = 1) {
    var vertices = [
      vec4(-0.5 * sideSize, -0.5 * sideSize, 0.5 * sideSize, 1.0),
      vec4(-0.5 * sideSize, 0.5 * sideSize, 0.5 * sideSize, 1.0),
      vec4(0.5 * sideSize, 0.5 * sideSize, 0.5 * sideSize, 1.0),
      vec4(0.5 * sideSize, -0.5 * sideSize, 0.5 * sideSize, 1.0),
      vec4(-0.5 * sideSize, -0.5 * sideSize, -0.5 * sideSize, 1.0),
      vec4(-0.5 * sideSize, 0.5 * sideSize, -0.5 * sideSize, 1.0),
      vec4(0.5 * sideSize, 0.5 * sideSize, -0.5 * sideSize, 1.0),
      vec4(0.5 * sideSize, -0.5 * sideSize, -0.5 * sideSize, 1.0),
    ];

    var vertexColors = [
      [0.0, 0.0, 0.0, 1.0], // black 0
      [1.0, 0.0, 0.0, 1.0], // red 1
      [1.0, 1.0, 0.0, 1.0], // yellow 2
      [0.0, 1.0, 0.0, 1.0], // green 3
      [0.0, 0.0, 1.0, 1.0], // blue 4
      [1.0, 0.0, 1.0, 1.0], // magenta
      [0.0, 1.0, 1.0, 1.0], // cyan
      [1.0, 1.0, 1.0, 1.0], // white
    ];

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices

    //vertex color assigned by the index of the vertex

    var indices = [a, b, c, a, c, d];

    for (var i = 0; i < indices.length; ++i) {
      // Adjust the vertices based on the center parameter
      var adjustedVertex = add(
        vertices[indices[i]],
        vec4(center[0], center[1], center[2], 0.0)
      );

      // Apply rotation to the adjusted vertex
      //   var rotatedVertex = mult(
      //     rotate(this.theta[0], [1, 0, 0]),
      //     mult(rotate(this.theta[1], [0, 1, 0]), rotate(this.theta[2], [0, 0, 1]))
      //   );

      //   rotatedVertex = this.multMat4Vec4(rotatedVertex, adjustedVertex);

      this.points.push(adjustedVertex);

      // for solid colored faces use
      if (color === -1) this.colors.push(vertexColors[a]);
      else this.colors.push(color);
    }
  }
}
