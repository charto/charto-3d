// This file is part of charto-3d, copyright (C) 2016 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

attribute vec3 aPosition;
attribute vec2 aUV;

uniform mat4 uProjection;
uniform mat4 uCamera;
uniform mat4 uTransform;
uniform mat3 uTransNormal;

varying highp vec2 vUV;

void main(void) {
	gl_Position = uProjection * (uCamera * (uTransform * vec4(aPosition, 1.0)));
	vUV = aUV;
}
