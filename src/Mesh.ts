export interface MeshSpec {
	position: number[];
	normal?: number[];
	uv?: number[];
	face?: number[];
}

export class MeshBuffer {
	constructor(gl: WebGLRenderingContext, mesh: Mesh) {
		function create(
			kind: number,
			Typed: Float32ArrayConstructor | Uint16ArrayConstructor,
			arr?: number[]
		) {
			if(!arr) return(arr);

			const buf = gl.createBuffer()!;
			gl.bindBuffer(kind, buf);
			gl.bufferData(kind, new Typed(arr), gl.STATIC_DRAW);

			return(buf);
		}

		this.position = create(gl.ARRAY_BUFFER, Float32Array, mesh.position)!;
		this.normal = create(gl.ARRAY_BUFFER, Float32Array, mesh.normal);
		this.uv = create(gl.ARRAY_BUFFER, Float32Array, mesh.uv);
		this.face = create(gl.ELEMENT_ARRAY_BUFFER, Uint16Array, mesh.face)!;
	}

	position: WebGLBuffer;
	normal?: WebGLBuffer;
	uv?: WebGLBuffer;
	face: WebGLBuffer;
}

export class Mesh implements MeshSpec {
	constructor(spec?: MeshSpec) {
		if(spec) {
			this.position = spec.position;
			this.normal = spec.normal;
			this.uv = spec.uv;
			this.face = spec.face || spec.position.slice(0, spec.position.length / 3).map(
				(dummy: number, index: number) => index
			);
		}
	}

	init(gl: WebGLRenderingContext) {
		this.buffer = new MeshBuffer(gl, this);
		return(this);
	}

	position: number[] = [];
	normal?: number[];
	uv?: number[];
	face: number[] = [];

	buffer?: MeshBuffer;
}
