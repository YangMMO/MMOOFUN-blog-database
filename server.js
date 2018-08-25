'use strict'

const mail = require('./mail.js');
const http = require('http');

const port = 80;

const server = http.createServer((req, res) => {
	for(var key in require.cache){
		if(!key.includes('node_modules')){
			delete require.cache[key];
		}
  }
  
  // 处理超时
  const timerId = setTimeout(() => {
    res.end(`processing timeout`);
  }, 3000);

  clearTimeout(timerId);

  require('./router').router(req,res);
});

server.listen(port, () => {
	console.log(`Server running`);
});


// 处理未捕获的异常
let errNum = 0;
process.on('uncaughtException', (err) => {
  // 限制进程频繁重启
  if (errNum > 0) return;
  errNum++;

  console.info(`error: ${err}`);
  mail.send('[服务器异常]' + err.toString(), err.stack);

  setTimeout(() => {
    errNum = 0;
  }, 1000 * 60 * 10)
})