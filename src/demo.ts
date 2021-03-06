// This file is part of charto-3d, copyright (C) 2016 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

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
import {Drag} from './Drag';

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

	const scene = new Scene();
	const renderer = new Renderer(gl);

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
			}, () => renderer.render(camera, scene))
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
			}, () => renderer.render(camera, scene))
		}
	});

	window.addEventListener('resize', (event: UIEvent) => {
		camera.setAspect(canvas.scrollWidth / canvas.scrollHeight);
		skyTriangle.update();
	});

	document.addEventListener('keydown', (event: KeyboardEvent) => {
		const directionY = new Vector3(0, 1, 0);
		let sin = Math.sin(Math.PI / 32);
		const cos = Math.cos(Math.PI / 32);
		let axis: Vector3 | undefined;

		switch(event.keyCode) {
			case 37: // Left
				sin = -sin;
			case 39: // Right
				axis = directionY;
				break;

			case 38: // Up
				sin = -sin;
			case 40: // Down
				if(camera.direction.y * sin > 0 || Math.abs(camera.direction.y) < 31/32) {
					axis = directionY.cross(camera.direction).setNormalized();
				}
				break;
		}

		if(axis) camera.rotateBy(sin, cos, axis);

		renderer.render(camera, scene);
	});

	const drag = new Drag(canvas, camera);

	drag.onClick = (position: Vector3) => {
		const inverse = camera.getMatrix().getTranspose3();
		// Scale marker and place it at position (which includes z displacement)
		const matrix = inverse.getScaled(1/128).getTranslated(
			inverse.transformVector(position).setAdd(camera.position)
		);

		const marker = new Cube({
			matrix: matrix,
			material: cubeMaterial
		});

		marker.init(gl);

		scene.addThing(marker);
	};

	drag.onMove = (position: Vector3) => {
		position.setNormalized();
		const direction = TransMatrix.solveDirection(drag.dragPosition, position, camera.direction);
		if(direction) camera.direction = direction;

		renderer.render(camera, scene);
	}
}

init();
