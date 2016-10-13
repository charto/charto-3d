// This file is part of charto-3d, copyright (C) 2016 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

declare var require: any;

const server = require('http-server').createServer({
	root: '.',
	cache: -1,
	robots: true,
	headers: {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Credentials': 'true'
	}
})

require('chokidar-socket-emitter')({app: server.server});

server.listen(6630);
