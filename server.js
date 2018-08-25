'use strict'

const http = require('http');

const port = 80;

const server = http.createServer((req, res) => {

	for(var key in require.cache){
		if(!key.includes('node_modules')){
			delete require.cache[key];
		}
	}
	require('./router').router(req,res);
});

server.listen(port, () => {
	console.log(`Server running`);
});