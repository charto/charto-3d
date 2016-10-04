export class Vector3 {
	constructor(x: number, y: number, z: number) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	setAdd(v: Vector3) {
		this.x += v.x;
		this.y += v.y;
		this.z += v.z;

		return(this);
	}

	setNormalized() {
		const x = this.x;
		const y = this.y;
		const z = this.z;

		let s = x * x + y * y + z * z;

		// For example the cross product of a vector with itself is zero.
		// Calculating the transformation matrix between them still works,
		// as long as division by zero is avoided here.

		if(s) {
			s = 1 / Math.sqrt(s);

			this.x = x * s;
			this.y = y * s;
			this.z = z * s;
		}

		return(this);
	}

	dot(v: Vector3) {
		return(this.x * v.x + this.y * v.y + this.z * v.z);
	}

	cross(v: Vector3) {
		return(new Vector3(
			this.y * v.z - this.z * v.y,
			this.z * v.x - this.x * v.z,
			this.x * v.y - this.y * v.x
		));
	}

	getInverse() {
		return(new Vector3(-this.x, -this.y, -this.z));
	}

	static fromArray(a: number[]) {
		return(new Vector3(a[0], a[1], a[2]));
	}

	static toArray(v: Vector3) {
		return([v.x, v.y, v.z]);
	}

	x: number;
	y: number;
	z: number;
}
