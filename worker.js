'use strict'

const http = require('http');
const mail = require('./mail.js');


// 监听server信息
let server = http.createServer();
server.listen(80, () => {
  console.log('Server running');
});
server.on('request', (req, res) => {
  for(var key in require.cache){
		if(!key.includes('node_modules')){
			delete require.cache[key];
		}
  }

  // 处理超时
  const timerId = setTimeout(() => {
    res.end(`processing timeout`);
  }, 10000);

  clearTimeout(timerId);

  require('./router').router(req,res);
  fun();
})

// 处理未捕获的异常
let errNum = 0;
process.on('uncaughtException', (err) => {
  // 限制进程频繁重启
  if (errNum > 0) return;
  errNum++;

  console.info(`error: ${err}`);
  process.send({act: 'suicide'});
  mail.send('[服务器异常]' + err.toString(), err.stack)
  
  // 关闭进程不接受请求
  server.close(() => {
    process.exit(1);
  });

  // 超时处理 退出
  setTimeout(() => {
    process.exit(1);
  }, 5000);
})