import {Vector3} from './Vector3';
import {Matrix3, stringify} from './Matrix3';
import {Camera} from './Camera';

/** 4x4 transformation or projection matrix. */

export class TransMatrix {

	/** Overwrite translation part with new position vector. */

	setTranslate(vector: Vector3) {
		this.data[12] = vector.x;
		this.data[13] = vector.y;
		this.data[14] = vector.z;

		return(this);
	}

	addTranslate(vector: Vector3) {
		this.data[12] += vector.x;
		this.data[13] += vector.y;
		this.data[14] += vector.z;

		return(this);
	}

	/** Overwrite rotation and scale part with a new rotation axis and angle. */

	setRotate(sin: number, cos: number, axis: Vector3) {
		const x = axis.x, y = axis.y, z = axis.z;
		const t = 1 - cos;

		const m = this.data;

		m[0] = t*x*x + cos;
		m[5] = t*y*y + cos;
		m[10] = t*z*z + cos;

		let p: number, q: number;

		p = t * x * y; q = sin * z;
		m[1] = p + q;
		m[4] = p - q;

		p = t * x * z; q = sin * y;
		m[8] = p + q;
		m[2] = p - q;

		p = t * y * z; q = sin * x;
		m[6] = p + q;
		m[9] = p - q;

		return(this);
	}

	/** Extract transpose of rotation and scale part to a new 3x3 matrix. */

	getTranspose3() {
		const matrix = new Matrix3();
		const d = matrix.data;
		const s = this.data;

		d[0] = s[0];
		d[1] = s[4];
		d[2] = s[8];

		d[3] = s[1];
		d[4] = s[5];
		d[5] = s[9];

		d[6] = s[2];
		d[7] = s[6];
		d[8] = s[10];

		return(matrix);
	}

	getFastInverse() {
		const matrix = new TransMatrix();
		const d = matrix.data;
		const s = this.data;

		d[ 0] = s[ 0];
		d[ 1] = s[ 4];
		d[ 2] = s[ 8];

		d[ 4] = s[ 1];
		d[ 5] = s[ 5];
		d[ 6] = s[ 9];

		d[ 8] = s[ 2];
		d[ 9] = s[ 6];
		d[10] = s[10];

		d[15] = 1;

		return(matrix.setTranslate(
			matrix.transformVector(new Vector3(-s[12], -s[13], -s[14]))
		));
	}

	transformVector(v: Vector3) {
		const m = this.data;
		const x = v.x, y = v.y, z = v.z;

		const px = m[ 0] * x + m[ 4] * y + m[ 8] * z + m[12];
		const py = m[ 1] * x + m[ 5] * y + m[ 9] * z + m[13];
		const pz = m[ 2] * x + m[ 6] * y + m[10] * z + m[14];

		return(new Vector3(px, py, pz));
	}

	projectVector(v: Vector3) {
		const m = this.data;
		const x = v.x, y = v.y, z = v.z;

		const px = m[ 0] * x + m[ 4] * y + m[ 8] * z + m[12];
		const py = m[ 1] * x + m[ 5] * y + m[ 9] * z + m[13];
		const pz = m[ 2] * x + m[ 6] * y + m[10] * z + m[14];
		const pw =                         m[11] * z;

		return(new Vector3(px / pw, py / pw, pz / pw));
	}

	multipliedBy(other: TransMatrix) {
		const matrix = new TransMatrix();
		const m = matrix.data;
		const a = this.data;
		const b = other.data;

		m[ 0] = a[ 0]*b[ 0] + a[ 4]*b[ 1] + a[ 8]*b[ 2];
		m[ 1] = a[ 1]*b[ 0] + a[ 5]*b[ 1] + a[ 9]*b[ 2];
		m[ 2] = a[ 2]*b[ 0] + a[ 6]*b[ 1] + a[10]*b[ 2];

		m[ 4] = a[ 0]*b[ 4] + a[ 4]*b[ 5] + a[ 8]*b[ 6];
		m[ 5] = a[ 1]*b[ 4] + a[ 5]*b[ 5] + a[ 9]*b[ 6];
		m[ 6] = a[ 2]*b[ 4] + a[ 6]*b[ 5] + a[10]*b[ 6];

		m[ 8] = a[ 0]*b[ 8] + a[ 4]*b[ 9] + a[ 8]*b[10];
		m[ 9] = a[ 1]*b[ 8] + a[ 5]*b[ 9] + a[ 9]*b[10];
		m[10] = a[ 2]*b[ 8] + a[ 6]*b[ 9] + a[10]*b[10];

		m[12] = a[ 0]*b[12] + a[ 4]*b[13] + a[ 8]*b[14] + a[12];
		m[13] = a[ 1]*b[12] + a[ 5]*b[13] + a[ 9]*b[14] + a[13];
		m[14] = a[ 2]*b[12] + a[ 6]*b[13] + a[10]*b[14] + a[14];
		m[15] = 1;

		return(matrix);
	}

	multipliedFullyBy(other: TransMatrix) {
		const matrix = new TransMatrix();
		const m = matrix.data;
		const a = this.data;
		const b = other.data;

		m[ 0] = a[ 0]*b[ 0] + a[ 4]*b[ 1] + a[ 8]*b[ 2] + a[12]*b[ 3];
		m[ 1] = a[ 1]*b[ 0] + a[ 5]*b[ 1] + a[ 9]*b[ 2] + a[13]*b[ 3];
		m[ 2] = a[ 2]*b[ 0] + a[ 6]*b[ 1] + a[10]*b[ 2] + a[14]*b[ 3];
		m[ 3] = a[ 3]*b[ 0] + a[ 7]*b[ 1] + a[11]*b[ 2] + a[15]*b[ 3];

		m[ 4] = a[ 0]*b[ 4] + a[ 4]*b[ 5] + a[ 8]*b[ 6] + a[ 12]*b[ 7];
		m[ 5] = a[ 1]*b[ 4] + a[ 5]*b[ 5] + a[ 9]*b[ 6] + a[ 13]*b[ 7];
		m[ 6] = a[ 2]*b[ 4] + a[ 6]*b[ 5] + a[10]*b[ 6] + a[ 14]*b[ 7];
		m[ 7] = a[ 3]*b[ 4] + a[ 7]*b[ 5] + a[11]*b[ 6] + a[ 15]*b[ 7];

		m[ 8] = a[ 0]*b[ 8] + a[ 4]*b[ 9] + a[ 8]*b[10] + a[12]*b[11];
		m[ 9] = a[ 1]*b[ 8] + a[ 5]*b[ 9] + a[ 9]*b[10] + a[13]*b[11];
		m[10] = a[ 2]*b[ 8] + a[ 6]*b[ 9] + a[10]*b[10] + a[14]*b[11];
		m[11] = a[ 3]*b[ 8] + a[ 7]*b[ 9] + a[11]*b[10] + a[15]*b[11];

		m[12] = a[ 0]*b[12] + a[ 4]*b[13] + a[ 8]*b[14] + a[12]*b[15];
		m[13] = a[ 1]*b[12] + a[ 5]*b[13] + a[ 9]*b[14] + a[13]*b[15];
		m[14] = a[ 2]*b[12] + a[ 6]*b[13] + a[10]*b[14] + a[14]*b[15];
		m[15] = a[ 3]*b[12] + a[ 7]*b[13] + a[11]*b[14] + a[15]*b[15];

		return(matrix);
	}

	/** Format nicely for debugging. */

	toString() {
		return(stringify(this.data, 4));
	}

	/** Create a new identity matrix. */

	static makeIdentity() {
		const matrix = new TransMatrix();
		const m = matrix.data;

		m[0] = m[5] = m[10] = m[15] = 1;

		return(matrix);
	}

	static makeRotate(sin: number, cos: number, axis: Vector3) {
		const matrix = new TransMatrix();

		matrix.setRotate(sin, cos, axis);
		matrix.data[15] = 1;

		return(matrix);
	}

	static makeOrient(position: Vector3, direction: Vector3, up: Vector3) {
		const matrix = new TransMatrix();
		const m = matrix.data;

		const axisX = up.cross(direction).setNormalized();
		const axisY = direction.cross(axisX);

		m[ 0] = axisX.x;
		m[ 1] = axisY.x;
		m[ 2] = direction.x;

		m[ 4] = axisX.y;
		m[ 5] = axisY.y;
		m[ 6] = direction.y;

		m[ 8] = axisX.z;
		m[ 9] = axisY.z;
		m[10] = direction.z;

		m[12] = -axisX.dot(position);
		m[13] = -axisY.dot(position);
		m[14] = -direction.dot(position);
		m[15] = 1;

		return(matrix);
	}

	/** Create a new projection matrix (different from standard OpenGL).
	  * x goes right.
	  * y goes up.
	  * z goes away. */

	static makePerspective(camera: Camera) {
		const zmin = camera.near;
		const zmax = camera.far;
		const ymax = zmin * camera.ySlope;
		const ymin = -ymax;
		const xmin = ymin * camera.aspect;
		const xmax = ymax * camera.aspect;

		const matrix = new TransMatrix();
		const m = matrix.data;

		m[0]  =         2*zmin / (xmax - xmin);
		m[5]  =         2*zmin / (ymax - ymin);
		// m[8]=-(xmax + xmin) / (xmax - xmin);
		// m[9]=-(ymax + ymin) / (ymax - ymin);
		m[10] =  (zmax + zmin) / (zmax - zmin);
		m[14] = -2*zmax*zmin   / (zmax - zmin);
		m[11] =  1;

		return(matrix);
	}

	static makeInversePerspective(camera: Camera) {
		const zmin = camera.near;
		const zmax = camera.far;
		const ymax = zmin * camera.ySlope;
		const ymin = -ymax;
		const xmin = ymin * camera.aspect;
		const xmax = ymax * camera.aspect;

		const matrix = new TransMatrix();
		const m = matrix.data;

		m[0]  =  (xmax - xmin) / (2*zmin);
		m[5]  =  (ymax - ymin) / (2*zmin);
		// m[12]=(xmax + xmin) / (2*zmin);
		// m[13]=(ymax + ymin) / (2*zmin);
		m[11] = -(zmax - zmin) / (2*zmax*zmin);
		m[15] =  (zmax + zmin) / (2*zmax*zmin);
		m[14] =  1;
		// Also divide m[14] and m[15] here by contents of m[11] in
		// makePerspective if it's nonzero

		return(matrix);
	}

	static from3(other: Matrix3, v: Vector3) {
		const matrix = new TransMatrix();
		const d = matrix.data;
		const s = other.data;

		d[ 0] = s[0];
		d[ 1] = s[1];
		d[ 2] = s[2];

		d[ 4] = s[3];
		d[ 5] = s[4];
		d[ 6] = s[5];

		d[ 8] = s[6];
		d[ 9] = s[7];
		d[10] = s[8];

		if(v) {
			d[12] = v.x;
			d[13] = v.y;
			d[14] = v.z;
		}

		d[15] = 1;

		return(matrix);
	}

	// Find camera direction closest to guess, so that the camera's rotation matrix
	// rotates a given unit vector in world coordinates to match another given
	// unit vector in the camera's coordinate space.

	static solveDirection(original: Vector3, projected: Vector3, guess?: Vector3) {
		const epsilon = 1/65536;

		const x = original.x;
		const y = original.y;
		const z = original.z;

		const lenSq = y*y + z*z;

		const p2 = projected.x * projected.x;
		const x2 = x*x;
		const y2 = y*y;
		const z2 = z*z;
		const x4 = x2*x2;
		const y4 = y2*y2;
		const z4 = z2*z2;

		const discriminant = Math.sqrt(y*y * (lenSq - projected.y * projected.y));

		let resultList: { cos: number, vector: Vector3 }[] = [];

		for(let i = 0; i < 4; ++i) {
			const sign1 = ((i << 1) & 2) - 1;
			const sign2 = (i & 2) - 1;

			const v = sign2 * (z * projected.y + sign1 * discriminant) / lenSq;

			if(isNaN(v)) continue;

			const v2 = v*v;
			const v4 = v2*v2;

			let F = -x4 - x2*z2 + x4*v2 - x2*y2*v2 + 2*x2*z2*v2 + x2*y2*v4 - x2*z2*v4 + x2*p2 - x2*v2*p2;

			let A = x2 + z2 - x2*v2 - y2*v2 - 2*z2*v2 + y2*v4 + z2*v4;
			let B = x4 + 2*x2*z2 + 2*x2*y2*v2 - 2*x2*z2*v2 - 2*y2*z2*v2 - 2*z4*v2 + y4*v4 + 2*y2*z2*v4 + z4*v4 + z4;
			let C = 2 * F + 2*z2*p2 + 2*y2*v2*p2 - 4*z2*v2*p2 - 2*y2*v4*p2 + 2*z2*v4*p2;
			let D =     F + 3*z2*p2 -   y2*v2*p2 - 6*z2*v2*p2 +   y2*v4*p2 + 3*z2*v4*p2;
			let E = x2 - 2*x2*v2 + x2*v4 - p2 + 2*v2*p2 - v4*p2;

			A /= B;
			C /= B;
			D /= B;
			E /= B;

			A *= projected.x;
			E *= projected.x;

			for(let j = 0; j < 16; ++j) {
				const sign3 = ((j << 1) & 2) - 1;
				const sign4 = (j & 2) - 1;
				const sign5 = ((j >> 1) & 2) - 1;
				const sign6 = ((j >> 2) & 2) - 1;

				let u = sign5 * (
					z * A +
					sign3 * Math.sqrt( (4 * z2 * A*A) + C - 2*D )/2 +
					sign4 * Math.sqrt(
						(8 * z2 * A*A) - C - 2*D + (
							sign3 * ((64 * z*z2 * A*A*A) - (32 * z * E) - (32 * z * A * D)) /
							(4 * Math.sqrt( (4 * z2 * A*A) + C - 2 * D ))
						)
					)/2
				);

				if(isNaN(u)) continue;

				const d = new Vector3(u, v, sign6 * Math.sqrt(1 - u*u - v*v));

				const p = TransMatrix.makeOrient(new Vector3(0, 0, 0), d, new Vector3(0, 1, 0)).transformVector(projected).setNormalized();
				const cosAngle = (p.x * original.x + p.y * original.y + p.z * original.z);

				if(cosAngle > 1 - epsilon) {
					resultList.push({
						cos: (p.x * original.x + p.y * original.y + p.z * original.z),
						vector: d
					});
				}
			}
		}

		resultList.sort((a, b) => b.cos - a.cos);

		return(resultList.length ? resultList[0].vector : null);
	}

	/** Internal storage format is directly compatible with OpenGL.  */
	data = new Float32Array(16);
}
