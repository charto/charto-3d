// This file is part of charto-3d, copyright (C) 2016 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

// Vertex shader for the sky, just storing viewing direction into the normal.

attribute vec3 aPosition;

uniform mat4 uProjection;
uniform mat4 uCamera;
uniform mat4 uTransform;

varying highp vec3 vNormal;

void main(void) {
	gl_Position = uProjection * (uTransform * vec4(aPosition, 1.0));

	// Multiply by camera matrix from the right (making it inverse).
	vNormal = aPosition * mat3(uCamera);
}
