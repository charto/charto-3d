System.config({
	defaultJSExtensions: true,
	transpiler: false,
	paths: {
		'glsl:*': 'src/glsl/*'
	},
	packages: {
		'src/glsl': {
			defaultExtension: false,
			map: { 'glsl': 'node_modules/systemjs-plugin-text/text' },
			meta: { '*': { loader: 'glsl' } }
		}
	}
});
