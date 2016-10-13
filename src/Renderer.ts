// This file is part of charto-3d, copyright (C) 2016 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

import {Vector3} from './Vector3';
import {TransMatrix} from './TransMatrix';
import {Camera} from './Camera';
import {Scene} from './Scene';
import {Thing} from './Thing';
import {Material} from './Material';

export class Renderer {
	constructor(gl: WebGLRenderingContext) {
		this.gl = gl;
	}
	render(camera: Camera, scene: Scene) {
		if(!this.scheduled) {
			this.scheduled = true;
			window.requestAnimationFrame(() => this.refresh(camera, scene));
		}
	}

	refresh(camera: Camera, scene: Scene) {
		this.scheduled = false;

		const gl = this.gl;

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		const cameraMatrix = camera.getMatrix();
		const normalMatrix = cameraMatrix.getTranspose3();

		let prevMaterial: Material | undefined;

		for(let thing of scene.thingList) {
			const mesh = thing.mesh;
			const material = thing.material;

			if(material != prevMaterial) {
				material!.activate(gl, this.attributeActiveList);

				gl.uniformMatrix4fv(
					gl.getUniformLocation(material!.shader.program, "uProjection")!,
					false,
					camera.projection.data
				);

				gl.uniformMatrix4fv(
					gl.getUniformLocation(material!.shader.program, "uCamera")!,
					false,
					cameraMatrix.data
				);

				gl.uniformMatrix3fv(
					gl.getUniformLocation(material!.shader.program, 'uTransNormal')!,
					false,
					normalMatrix.data
				);

				prevMaterial = material;
			}

			gl.uniformMatrix4fv(
				gl.getUniformLocation(material!.shader.program, "uTransform")!,
				false,
				thing.matrix.data
			);

			thing.activate(gl);

			gl.drawElements(gl.TRIANGLES, mesh.face.length, gl.UNSIGNED_SHORT, 0);
		}
	}

	scheduled = false;

	attributeActiveList: boolean[] = [];

	gl: WebGLRenderingContext;
}
