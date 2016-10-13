// This file is part of charto-3d, copyright (C) 2016 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

export interface TextureSpec {
	url: string;
}

export function isPow2(n: number) {
	return((n & (n - 1)) == 0);
}

export class Texture implements TextureSpec {
	constructor(gl: WebGLRenderingContext, spec: TextureSpec, onReady: () => void) {
		this.url = spec.url;
		this.buffer = gl.createTexture()!;

		const image = new Image();

		image.onload = () => this.handleLoaded(gl, image);
		image.src = this.url;

		this.onReady = onReady;

		++Texture.pending;
	}

	handleLoaded(gl: WebGLRenderingContext, image: HTMLImageElement) {
		gl.bindTexture(gl.TEXTURE_2D, this.buffer);

		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

		if(isPow2(image.width | image.height)) {
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
			gl.generateMipmap(gl.TEXTURE_2D);
		} else {
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		}

		gl.bindTexture(gl.TEXTURE_2D, null);

		// TODO: implement a texture manager that fires this event instead.
		if(--Texture.pending == 0) this.onReady();
	}

	activate(gl: WebGLRenderingContext) {
		gl.bindTexture(gl.TEXTURE_2D, this.buffer);
	}

	url: string;
	buffer: WebGLTexture;

	onReady: () => void;

	static pending = 0;
}
