// This file is part of charto-3d, copyright (C) 2016 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

import {Vector3} from './Vector3';
import {Matrix3} from './Matrix3';
import {Camera} from './Camera';

export class Drag {
	constructor(canvas: HTMLCanvasElement, camera: Camera) {
		const self: Drag = this;
		this.canvas = canvas;
		this.camera = camera;

		const clickDistance = 4;

		function handleMove(event: MouseEvent) {
			const parsed = self.parseEvent(event);

			if(self.onMove) self.onMove(parsed.position);
		}

		function handleUp(event: MouseEvent) {
			const parsed = self.parseEvent(event);
			const dx = parsed.canvasX - self.dragX;
			const dy = parsed.canvasY - self.dragY;

			if(self.onClick && dx * dx + dy * dy < clickDistance * clickDistance) {
				self.onClick(parsed.position);
			}

			canvas.removeEventListener('mousemove', handleMove);
			canvas.removeEventListener('mouseup', handleUp);
		}

		canvas.addEventListener('mousedown', (event: MouseEvent) => {
			const parsed = this.parseEvent(event);

			this.dragX = parsed.canvasX;
			this.dragY = parsed.canvasY;
			this.dragCameraDirection = this.camera.direction;
			this.dragInverse = this.camera.getMatrix().getTranspose3();
			this.dragPosition = this.dragInverse.transformVector(parsed.position).setNormalized();

			canvas.addEventListener('mousemove', handleMove);
			canvas.addEventListener('mouseup', handleUp);
		});
	}

	parseEvent(event: MouseEvent) {
		const bound = this.canvas.getBoundingClientRect();
		const canvasX = event.clientX - bound.left;
		const canvasY = event.clientY - bound.top;
		const halfWidth = bound.width / 2;
		const halfHeight = bound.height / 2;

		const z = 1;
		const pixelSize = z * this.camera.ySlope / halfHeight;

		const x = (canvasX - halfWidth) * pixelSize;
		const y = (halfHeight - canvasY) * pixelSize;

		/** Marker position relative to camera pointing towards positive Z. */
		return({
			canvasX: canvasX,
			canvasY: canvasY,
			position: new Vector3(x, y, z)
		});
	}

	onClick: (position: Vector3) => void;
	onMove: (position: Vector3) => void;

	dragX: number;
	dragY: number;
	dragPosition: Vector3;
	dragCameraDirection: Vector3;
	dragInverse: Matrix3;

	canvas: HTMLCanvasElement;
	camera: Camera;
}
