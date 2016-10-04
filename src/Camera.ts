import {Vector3} from './Vector3';
import {TransMatrix} from './TransMatrix';

export interface CameraSpec {
	yfov: number;
	aspect: number;
	near: number;
	far: number;

	position?: Vector3;
	direction?: Vector3;
}

/** Camera and projection handling. */

export class Camera implements CameraSpec {
	constructor(spec: CameraSpec) {
		this.yfov = spec.yfov;
		this.near = spec.near;
		this.far = spec.far;

		this.fovScale = Math.tan(this.yfov * Math.PI / 360);
		this.setAspect(spec.aspect);

		this.position = spec.position || new Vector3(0, 0, 0);
		this.setDirection(spec.direction || new Vector3(0, 0, 1));
	}

	setAspect(aspect: number) {
		this.aspect = aspect;
		this.xfov = Math.atan(this.aspect * this.fovScale) * 360 / Math.PI;

		this.projection = TransMatrix.makePerspective(this);
	}

	setDirection(direction: Vector3) {
		this.direction = direction.setNormalized();
	}

	getMatrix() {
		const directionY = new Vector3(0, 1, 0);

		return(TransMatrix.makeOrient(this.position, this.direction, directionY));
	}

	/** Horizontal field of view. */
	xfov: number;
	/** Vertical field of view. */
	yfov: number;
	/** Drawing area aspect ratio. */
	aspect: number;
	/** Ratio between pixel size and z coordinate. */
	fovScale: number;

	/** Distance to near clipping plane where everything is projected. */
	readonly near: number;
	/** Far clipping plane, distance limit for drawn objects. */
	readonly far: number;

	/** Perspective projection matrix. */
	projection: TransMatrix;

	position: Vector3;
	direction: Vector3;
}
