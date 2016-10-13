// This file is part of charto-3d, copyright (C) 2016 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

varying highp vec2 vUV;

uniform sampler2D uTexture;

void main(void) {
	gl_FragColor = texture2D(uTexture, vUV);
}
