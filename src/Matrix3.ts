// This file is part of charto-3d, copyright (C) 2016 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

import {Vector3} from './Vector3';
import {TransMatrix} from './TransMatrix';

export function stringify(data: Float32Array, size: number) {
	const widths: number[] = [];
	const output: string[] = [];
	let item: string;
	let width: number;
	let p = 0;

	for(let x = 0; x < size; ++x) widths[x] = 0;

	for(let y = 0; y < size; ++y) {
		for(let x = 0; x < size; ++x) {
			item = (Math.round(data[p++] * 10000) / 10000).toString();
			width = item.length;

			if(width > widths[x]) widths[x] = width;
		}
	}

	p = 0;

	for(let y = 0; y < size; ++y) {
		const row: string[] = [];
		for(let x = 0; x < size; ++x) {
			item = (Math.round(data[p++] * 10000) / 10000).toString();
			width = item.length;

			row.push(new Array(widths[x] - width + 1).join(' ') + item);
		}

		output.push(row.join('  '));
	}

	return(output.join('\n'));
}

/** 3x3 rotation and scaling matrix. */

export class Matrix3 {
	transformVector(v: Vector3) {
		const m = this.data;
		const x = v.x, y = v.y, z = v.z;

		const px = m[0] * x + m[3] * y + m[6] * z;
		const py = m[1] * x + m[4] * y + m[7] * z;
		const pz = m[2] * x + m[5] * y + m[8] * z;

		return(new Vector3(px, py, pz));
	}

	getTranslated(vector: Vector3) {
		return(TransMatrix.from3(this, vector));
	}

	getScaled(scale: number) {
		const matrix = new Matrix3();

		for(let i = 0; i < 9; ++i) matrix.data[i] = this.data[i] * scale;

		return(matrix);
	}

	/** Format nicely for debugging. */

	toString() {
		return(stringify(this.data, 3));
	}

	/** Internal storage format is directly compatible with OpenGL.  */
	data = new Float32Array(9);
}
