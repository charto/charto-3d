import {Vector3} from './Vector3';
import {TransMatrix} from './TransMatrix';
import {Mesh, MeshSpec} from './Mesh';
import {Thing, ThingSpec} from './Thing';

function flatten<Member>(arrayList: Member[][]) {
	return(Array.prototype.concat.apply([], arrayList) as Member[]);
}

function flattenSpecList(specList: MeshSpec[]) {
	return({
		position: flatten(specList.map((spec: MeshSpec) => spec.position)),
		normal: flatten(specList.map((spec: MeshSpec) => spec.normal!)),
		uv: flatten(specList.map((spec: MeshSpec) => spec.uv!)),
		face: flatten(specList.map((spec: MeshSpec) => spec.face!))
	});
}

export class Cube extends Thing {
	constructor(spec: ThingSpec) {
		let vertexCount = 0;

		/** Construct a cube face from one corner (becomes the texture origin)
		  * and the face normal. */

		function face(firstCorner: number[], normal: number[]) {
			const normalVector = Vector3.fromArray(normal);

			function getCorners(corner: number[]) {
				const cornerVector = Vector3.fromArray(corner);

				return([[0, 1], [1, 0], [0, -1], [-1, 0]].map(
					(pair: [number, number]) => ( TransMatrix
						.makeRotate(pair[0], pair[1], normalVector)
						.transformVector(cornerVector)
					)
				))
			}

			const meshSpec: MeshSpec = {
				position: flatten(getCorners(firstCorner).map(Vector3.toArray)),
				normal: flatten([1, 2, 3, 4].map(() => normal)),
				uv: flatten([1, 2, 3, 4].map(() => [0, 1, 0, 0, 1, 0, 1, 1])),
				face: [0, 1, 2, 0, 2, 3].map((index: number) => vertexCount + index)
			};

			vertexCount += 4;

			return(meshSpec);
		}

		spec.mesh = new Mesh(flattenSpecList([
			face([-1, -1, -1], [ 0,  0, -1]), // front
			face([-1, -1,  1], [-1,  0,  0]), // left
			face([ 1, -1,  1], [ 0,  0,  1]), // back
			face([ 1, -1, -1], [ 1,  0,  0]), // right

			face([-1,  1, -1], [ 0,  1,  0]), // top
			face([ 1, -1,  1], [ 0, -1,  0])  // bottom
		]));

		super(spec);
	}
}
