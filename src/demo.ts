import {Vector3} from './Vector3';
import {TransMatrix} from './TransMatrix';
import {Scene} from './Scene';
import {Camera} from './Camera';
import {Renderer} from './Renderer';
import {SkyTriangle} from './SkyTriangle';
import {Material} from './Material';
import {Texture} from './Texture';
import {TextureCube} from './TextureCube';
import {Cube} from './Cube';
import {Shader, Attribute} from './Shader';

import * as skyVertex from 'glsl:sky.vert';
import * as panoramaFragment from 'glsl:equirectangular.frag';
import * as cubeFragment from 'glsl:cubemap.frag';

import * as textureVertex from 'glsl:texture.vert';
import * as textureFragment from 'glsl:texture.frag';

export function init() {
	const canvas = document.getElementById('view') as HTMLCanvasElement;
	const gl = canvas.getContext('experimental-webgl')!;

	const camera = new Camera({
		yfov: 60,
		aspect: canvas.scrollWidth / canvas.scrollHeight,
		near: 0.1,
		far: 100,

		position: new Vector3(0, 0, -6),
		direction: new Vector3(0, 0, 1)
	});

	// Clear to black.
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clearDepth(1.0);

	// Enable depth test, closer geometry on top.
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);

	// Enable backface culling.
	gl.enable(gl.CULL_FACE);
	gl.cullFace(gl.FRONT);

	var scene = new Scene();

	const skyMaterial = new Material({
		shader: new Shader(gl, {
			vertex: skyVertex,
			fragment: panoramaFragment,
			attributes: {
				[Attribute.position]: 'aPosition'
			}
		}),
		textures: {
			'uTexture': new Texture(gl, {
				url: 'panorama.jpg'
			})
		}
	});

	const skyTriangle = new SkyTriangle({
		camera: camera,
		material: skyMaterial
	});

	skyTriangle.init(gl);

	scene.addThing(skyTriangle);

	const cubeMaterial = new Material({
		shader: new Shader(gl, {
			vertex: textureVertex,
			fragment: textureFragment,
			attributes: {
				[Attribute.position]: 'aPosition',
				[Attribute.uv]: 'aUV'
			}
		}),
		textures: {
			'uTexture': new Texture(gl, {
				url: 'cube.png'
			})
		}
	});

	window.addEventListener('resize', (event: UIEvent) => {
		camera.setAspect(canvas.scrollWidth / canvas.scrollHeight);
		skyTriangle.update();
	});

	canvas.addEventListener('click', (event: MouseEvent) => {
		var bound = canvas.getBoundingClientRect();
		var projectedX = event.clientX - bound.left;
		var projectedY = event.clientY - bound.top;
		var halfWidth = bound.width / 2;
		var halfHeight = bound.height / 2;

		const directionY = new Vector3(0, 1, 0);

		const inverse = camera.getMatrix().getTranspose3();

		const z = 1;
		const pixelSize = z * camera.ySlope / halfHeight;

		const x = (projectedX - halfWidth) * pixelSize;
		const y = (halfHeight - projectedY) * pixelSize;

		/** Marker position relative to camera pointing towards positive Z. */
		const markerPosition = new Vector3(
			(projectedX / halfWidth - 1) * z * camera.ySlope * camera.aspect,
			(1 - projectedY / halfHeight) * z * camera.ySlope,
			z
		);
		const matrix = inverse.getScaled(1/128).getTranslated(
			inverse.transformVector(markerPosition).setAdd(camera.position)
		);

		const marker = new Cube({
			matrix: matrix,
			material: cubeMaterial
		});

		marker.init(gl);

		scene.addThing(marker);
	}, false);

	const renderer = new Renderer(gl);

	setInterval(() => renderer.render(camera, scene), 100);
}

init();
