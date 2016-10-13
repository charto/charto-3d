// This file is part of charto-3d, copyright (C) 2016 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

import {Vector3} from './Vector3';
import {TransMatrix} from './TransMatrix';

export interface CameraSpec {
	yfov: number;
	aspect: number;
	near: number;
	far: number;

	position?: Vector3;
	direction?: Vector3;
	up?: Vector3;
}

/** Camera and projection handling. */

export class Camera implements CameraSpec {
	constructor(spec: CameraSpec) {
		this.yfov = spec.yfov;
		this.near = spec.near;
		this.far = spec.far;

		this.ySlope = Math.tan(this.yfov * Math.PI / 360);
		this.setAspect(spec.aspect);

		this.position = spec.position || new Vector3(0, 0, 0);
		this.setDirection(spec.direction || new Vector3(0, 0, 1));
		this.up = spec.up || new Vector3(0, 1, 0);
	}

	setAspect(aspect: number) {
		this.aspect = aspect;
		this.xfov = Math.atan(this.aspect * this.ySlope) * 360 / Math.PI;

		this.projection = TransMatrix.makePerspective(this);
	}

	setDirection(direction: Vector3) {
		this.direction = direction.setNormalized();
	}

	rotateBy(sin: number, cos: number, axis: Vector3) {
		this.direction = (TransMatrix
			.makeRotate(sin, cos, axis)
			.transformVector(this.direction)
			.setNormalized()
		);
	}

	getMatrix() {
		return(TransMatrix.makeOrient(this.position, this.direction, this.up));
	}

	/** Horizontal field of view. */
	xfov: number;
	/** Vertical field of view. */
	yfov: number;
	/** Drawing area aspect ratio. */
	aspect: number;
	/** Ratio between pixel size and z coordinate. */
	ySlope: number;

	/** Distance to near clipping plane where everything is projected. */
	readonly near: number;
	/** Far clipping plane, distance limit for drawn objects. */
	readonly far: number;

	/** Perspective projection matrix. */
	projection: TransMatrix;

	position: Vector3;
	direction: Vector3;
	up: Vector3;
}
