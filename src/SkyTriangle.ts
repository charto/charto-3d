import {Camera} from './Camera';
import {Mesh} from './Mesh';
import {Thing, ThingSpec} from './Thing';

export interface SkyTriangleSpec extends ThingSpec {
	camera: Camera;
}

/** A single triangle for rendering a background cubemap. */

export class SkyTriangle extends Thing implements SkyTriangleSpec {
	constructor(spec: SkyTriangleSpec) {
		const z = spec.camera.far;
		const y = z * spec.camera.fovScale;
		const x = y * spec.camera.aspect;

		spec.mesh = new Mesh({
			position: [
				 0,      y * 3, z,
				 x * 2, -y,     z,
				-x * 2, -y,     z
			]
		});

		super(spec);

		this.camera = spec.camera;
	}

	update() {
		// TODO
	}

	camera: Camera;
}
