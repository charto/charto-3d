// This file is part of charto-3d, copyright (C) 2016 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

import {TransMatrix} from './TransMatrix';
import {Mesh} from './Mesh';
import {Material} from './Material';
import {Attribute} from './Shader';

export interface ThingSpec {
	matrix?: TransMatrix;
	mesh?: Mesh;
	material?: Material;
}

export class Thing implements ThingSpec {
	constructor(spec: ThingSpec) {
		this.matrix = spec.matrix || TransMatrix.makeIdentity();
		this.mesh = spec.mesh || new Mesh();
		this.material = spec.material;
	}

	init(gl: WebGLRenderingContext) {
		this.mesh.init(gl);
	}

	activate(gl: WebGLRenderingContext) {
		gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.buffer!.position);
		gl.vertexAttribPointer(Attribute.position, 3, gl.FLOAT, false, 0, 0);

		if(this.material!.shader.attributeUsedList[Attribute.uv]) {
			gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.buffer!.uv!);
			gl.vertexAttribPointer(Attribute.uv, 2, gl.FLOAT, false, 0, 0);
		}

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mesh.buffer!.face);
	}

	matrix: TransMatrix;

	mesh: Mesh;
	material?: Material;
}
