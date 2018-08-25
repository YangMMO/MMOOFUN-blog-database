'use strict'

const cluster = require('cluster');
const cpuNum = require('os').cpus().length;
const mail = require('./mail.js');
const http = require('http');

//创建cluster集群
if (cluster.isMaster) {
  //轮叫调度
  cluster.schedulingPolicy = cluster.SCHED_RR;

  let workers = {};
  let prevDate = new Date().getTime();

  // 创建工作进程
  for (let i = 0; i < cpuNum; i++) {
    cluster.fork();    
  }

  // exit事件
  cluster.on('exit', (worker, code) => {
    console.info(`worker[${worker.process.pid}] exit, code: ${code}`)
    delete workers[worker.process.pid];
  })

  // fork事件
  cluster.on('fork', worker => {
    workers[worker.process.pid] = worker;

    // 进程通信
    worker.on('message', info => {
      if (info.act === 'suicide') {
        let err = info.error;

        console.info(`worker[${worker.process.pid}] suicide`);
        cluster.fork();

        if (err.date > prevDate + 600000) {
          prevDate = err.date;
          mail.send('[服务器异常]' + err.title, err.content)
        }
      }
    });
    console.info(`worker[${worker.process.pid}] fork success`);
  });
} else {
  // require('./worker.js');

  // 监听server信息
  let server = http.createServer((req, res) => {
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
  });

  server.listen(80, () => {
    console.log('Server running');
  });

  // 处理未捕获的异常
  let errNum = 0;
  process.on('uncaughtException', (err) => {
    // 限制进程频繁重启
    if (errNum > 0) return;
    errNum++;

    console.info(`error: ${err}`);
    process.send({
      act: 'suicide',
      error: {
        title:  err.toString(),
        content: err.stack,
        date: new Date().getTime()
      }
    });
    
    // 关闭进程不接受请求
    server.close(() => {
      process.exit(1);
    });

    // 超时处理 退出
    setTimeout(() => {
      process.exit(1);
    }, 5000);
  })
}



















// const http = require('http');

// const port = 80;

// const server = http.createServer((req, res) => {

// 	for(var key in require.cache){
// 		if(!key.includes('node_modules')){
// 			delete require.cache[key];
// 		}
// 	}
// 	require('./router').router(req,res);
// });

// server.listen(port, () => {
// 	console.log(`Server running`);
// });