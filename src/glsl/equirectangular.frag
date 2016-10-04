// Equirectangular panorama fragment shader, use with sky.vert.

varying highp vec3 vNormal;

const highp float invpi = 0.3183098861837907;
const highp float inv2pi = 0.15915494309189534;

uniform sampler2D uTexture;

void main(void) {
	gl_FragColor = texture2D(
		uTexture,
		vec2(
			atan(vNormal.x, vNormal.z) * inv2pi + 0.5,
			acos(normalize(vNormal).y) * invpi
		)
	);
}
