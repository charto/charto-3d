import {Vector3} from './Vector3';
import {TransMatrix} from './TransMatrix';
import {Camera} from './Camera';
import {Scene} from './Scene';
import {Thing} from './Thing';
import {Material} from './Material';

export class Renderer {
	constructor(gl: WebGLRenderingContext) {
		this.gl = gl;
		this.startTime = new Date().getTime();
	}

	render(camera: Camera, scene: Scene) {
		const gl = this.gl;

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		const angle = (new Date().getTime() - this.startTime) * 10 / 1000 * Math.PI / 180;

		const directionY = new Vector3(0, 1, 0);

		camera.setDirection(TransMatrix.makeRotate(
			Math.sin(angle),
			Math.cos(angle),
			directionY
		).transformVector(new Vector3(0, 0, 1)));

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

	attributeActiveList: boolean[] = [];

	gl: WebGLRenderingContext;
	startTime: number;
}
