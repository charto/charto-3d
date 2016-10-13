// This file is part of charto-3d, copyright (C) 2016 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

// Cube map fragment shader, use with sky.vert.

varying highp vec3 vNormal;

uniform samplerCube uCubeTexture;

void main(void) {
	gl_FragColor = textureCube(uCubeTexture, vNormal);
}
