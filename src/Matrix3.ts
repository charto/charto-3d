import {Vector3} from './Vector3';
import {TransMatrix} from './TransMatrix';

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

	/** Internal storage format is directly compatible with OpenGL.  */
	data = new Float32Array(9);
}
