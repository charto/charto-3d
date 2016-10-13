// This file is part of charto-3d, copyright (C) 2016 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

export const enum Attribute {
	position = 0,
	uv = 1
}

export interface ShaderSpec {
	vertex: string;
	fragment: string;
	attributes: { [kind: number]: string };
}

export class Shader {
	constructor(gl: WebGLRenderingContext, spec: ShaderSpec) {
		const program = gl.createProgram()!;

		gl.attachShader(program, this.getShader(gl, spec.vertex, gl.VERTEX_SHADER));
		gl.attachShader(program, this.getShader(gl, spec.fragment, gl.FRAGMENT_SHADER));

		for(let kind of Object.keys(spec.attributes)) {
			const ptr: Attribute = +kind;

			gl.bindAttribLocation(program, ptr, spec.attributes[ptr]);
			this.attributeUsedList[ptr] = true;
		}

		gl.linkProgram(program);

		if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			throw(new Error('Shader link error: ' + gl.getProgramInfoLog(program)));
		}

		gl.useProgram(program);
		this.program = program;
	}

	getShader(gl: WebGLRenderingContext, source: string, kind: number) {
		const shader = gl.createShader(kind)!;

		gl.shaderSource(shader, source);
		gl.compileShader(shader);

		if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			throw(new Error('Shader compile error: ' + gl.getShaderInfoLog(shader)));
		}

		return(shader);
	}

	program: WebGLProgram;
	attributeUsedList: boolean[] = [];
}
