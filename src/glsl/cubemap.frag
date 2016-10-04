// Cube map fragment shader, use with sky.vert.

varying highp vec3 vNormal;

uniform samplerCube uCubeTexture;

void main(void) {
	gl_FragColor = textureCube(uCubeTexture, vNormal);
}
