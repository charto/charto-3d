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
		const axisY = direction.cross(axisX).setNormalized();

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

	/** Internal storage format is directly compatible with OpenGL.  */
	data = new Float32Array(16);
}
