// This file is part of charto-3d, copyright (C) 2016 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

import {Shader, Attribute} from './Shader';
import {Texture} from './Texture';

export interface MaterialSpec {
	shader: Shader;
	textures: { [sampler: string]: Texture };
}

export class Material implements MaterialSpec {
	constructor(spec: MaterialSpec) {
		this.shader = spec.shader;
		this.textures = spec.textures;
	}

	activate(gl: WebGLRenderingContext, attributeActiveList: boolean[]) {
		gl.useProgram(this.shader.program);

		const attributeUsedList = this.shader.attributeUsedList;
		let attributeCount = Math.max(attributeUsedList.length, attributeActiveList.length);

		for(var ptr: Attribute = 0; ptr < attributeCount; ++ptr) {
			if(attributeUsedList[ptr] != attributeActiveList[ptr]) {
				if(attributeUsedList[ptr]) {
					gl.enableVertexAttribArray(ptr);
				} else {
					gl.disableVertexAttribArray(ptr);
				}
			}
		}

		Object.keys(this.textures).forEach((sampler: string, index: number) => {
			gl.activeTexture((gl as any as { [key: string]: number })['TEXTURE' + index]);
			this.textures[sampler].activate(gl);
			gl.uniform1i(gl.getUniformLocation(this.shader.program, sampler), index);
		})
	}

	readonly shader: Shader;
	readonly textures: { [sampler: string]: Texture };
}
